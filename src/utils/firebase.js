import { async } from "@firebase/util";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  FacebookAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";

import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  Timestamp,
  updateDoc,
  onSnapshot,
  startAfter,
  setDoc,
} from "firebase/firestore";

import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";
import { check } from "prettier";
import { theWindow } from "tone/build/esm/core/context/AudioContext";

const firebaseConfig = {
  apiKey: "AIzaSyCAHli85vuDjMNmK3r0_1k3VQvYSysvUFg",
  authDomain: "visual-sound-db.firebaseapp.com",
  projectId: "visual-sound-db",
  storageBucket: "visual-sound-db.appspot.com",
  messagingSenderId: "787155335374",
  appId: "1:787155335374:web:01814d19cc4c2b46ceb89f",
  measurementId: "G-K7K9LNCM0G",
};

const Firebase = {
  app: initializeApp(firebaseConfig),
  pageLimit: 10,
  ProviderFB() {
    return new FacebookAuthProvider();
  },
  auth() {
    return getAuth(this.app);
  },
  db() {
    return getFirestore(this.app);
  },
  worksRef() {
    return collection(this.db(), "works");
  },
  tagsRef() {
    return doc(this.db(), "tags", "BprzcEpU3l2hdnlvJQde");
  },
  async addNewUser(user) {
    const userRef = doc(this.db(), "users", user.uid);
    await setDoc(userRef, {
      user_name: user.displayName,
      user_email: user.email,
      user_bio: "",
      user_thumbnail:
        user.reloadUserInfo.photoUrl ||
        `https://joeschmoe.io/api/v1/${user.displayName}`,
      following: [],
      followers: [],
    });

    return this.auth().currentUser;
  },
  async register(username, email, password) {
    const userCredential = await createUserWithEmailAndPassword(
      this.auth(),
      email,
      password
    );
    const user = userCredential.user;

    await updateProfile(user, { displayName: username });

    const currentUser = await this.addNewUser(user);
    return currentUser;
  },
  async login(email, password) {
    const userCredential = await signInWithEmailAndPassword(
      this.auth(),
      email,
      password
    );
    return userCredential.user;
  },
  async SignInWithFB() {
    try {
      const result = await signInWithPopup(this.auth(), this.ProviderFB());
      const user = result.user;

      const credential = FacebookAuthProvider.credentialFromResult(result);
      const accessToken = credential.accessToken;

      const currentUser = await this.addNewUser(user);
      return { currentUser, accessToken };
    } catch (error) {
      console.log(error);
    }
  },
  async getAllworks(lastVisibleData) {
    let queryCondition;
    if (lastVisibleData) {
      queryCondition = query(
        this.worksRef(),
        orderBy("created_time", "desc"),
        startAfter(lastVisibleData),
        limit(this.pageLimit)
      );
    } else {
      queryCondition = query(
        this.worksRef(),
        orderBy("created_time", "desc"),
        limit(this.pageLimit)
      );
    }

    const snapshot = await getDocs(queryCondition);
    const fetchWorks = await Promise.all(
      snapshot.docs.map(async (item) => {
        const userInfo = await this.getUserBasicInfo(item.data().author_id);
        return {
          id: item.id,
          ...item.data(),
          ...userInfo,
        };
      })
    );
    const lastVisibleWork = snapshot.docs[this.pageLimit - 1];
    return { fetchWorks, lastVisibleWork };
  },
  async searchWorks(term, lastVisibleData) {
    let queryCondition;
    if (lastVisibleData) {
      queryCondition = query(
        this.worksRef(),
        where("tags", "array-contains", term),
        orderBy("created_time", "desc"),
        startAfter(lastVisibleData),
        limit(this.pageLimit)
      );
    } else {
      queryCondition = query(
        this.worksRef(),
        where("tags", "array-contains", term),
        orderBy("created_time", "desc"),
        limit(this.pageLimit)
      );
    }

    const snapshot = await getDocs(queryCondition);
    const fetchWorks = await Promise.all(
      snapshot.docs.map(async (item) => {
        const authorInfo = await this.getUserBasicInfo(item.data().author_id);
        return {
          id: item.id,
          ...item.data(),
          ...authorInfo,
        };
      })
    );
    const lastVisibleWork = snapshot.docs[this.pageLimit - 1];
    return { fetchWorks, lastVisibleWork };
  },
  async getFollowingList(id) {
    const docRef = doc(this.db(), "users", id);
    const docSnap = await getDoc(docRef);

    return docSnap.data()?.following;
  },
  async getFollowingWorks(id) {
    //haven't test more than 10
    const followingList = await this.getFollowingList(id);

    if (!followingList || followingList.length === 0) return [];

    if (followingList.length <= 10)
      return this.getUnderTenFollowingsWorks(followingList);

    const splitFollowingList = [];
    while (followingList.length) {
      splitFollowingList.push(followingList.splice(0, 10));
    }

    const allFollowingWorks = [];

    async function gerAllworks() {
      for (const list of splitFollowingList) {
        const works = await Firebase.getUnderTenFollowingsWorks(list);
        allFollowingWorks.push(...works);
      }
    }
    gerAllworks();

    const sortedFollowingWorks = allFollowingWorks.sort((a, b) => {
      return (
        b.latestMessage.created_time.seconds -
        a.latestMessage.created_time.seconds
      );
    });

    return sortedFollowingWorks;
  },
  async getUnderTenFollowingsWorks(list) {
    const queryCondition = query(
      this.worksRef(),
      where("author_id", "in", list),
      orderBy("created_time", "desc")
    );
    const snapShot = await getDocs(queryCondition);
    const allworks = await Promise.all(
      snapShot.docs.map(async (item) => {
        const userInfo = await this.getUserBasicInfo(item.data().author_id);
        const latestComments = await this.getLatestComments(item.id);
        return {
          id: item.id,
          ...item.data(),
          ...userInfo,
          latestComments: latestComments,
        };
      })
    );
    return allworks;
  },
  async getUserBasicInfo(id) {
    const docRef = doc(this.db(), "users", id);
    const docSnap = await getDoc(docRef);

    return {
      author_id: docSnap.id,
      author_name: docSnap.data().user_name,
      author_thumbnail: docSnap.data().user_thumbnail,
    };
  },
  async getProfile(id) {
    const docRef = doc(this.db(), "users", id);
    const docSnap = await getDoc(docRef);

    return docSnap.data();
  },
  async getUserWorks(uid) {
    const queryByUser = query(
      collection(this.db(), "works"),
      orderBy("created_time", "desc"),
      where("author_id", "==", uid)
    );
    const querySnapshot = await getDocs(queryByUser);
    const userWorks = querySnapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });

    return userWorks;
  },
  async getUserCollection(uid) {
    const queryCondition = query(
      this.worksRef(),
      orderBy("created_time", "desc"),
      where("collected_by", "array-contains", uid)
    );
    const snapshot = await getDocs(queryCondition);
    const collectedWorks = snapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });

    return collectedWorks;
  },
  async getWork(id) {
    const docRef = doc(this.db(), "works", id);
    const docSnap = await getDoc(docRef);
    const authorInfo = await this.getUserBasicInfo(docSnap.data().author_id);

    return {
      id: docSnap.id,
      ...docSnap.data(),
      ...authorInfo,
    };
  },
  async likeWork(uid, id, currentLikedByList) {
    await updateDoc(doc(this.db(), "works", id), {
      liked_by: [...currentLikedByList, uid],
    });
  },
  async unlikeWork(uid, id, currentLikedByList) {
    const newLikeByList = currentLikedByList.filter((id) => id !== uid);
    await updateDoc(doc(this.db(), "works", id), {
      liked_by: newLikeByList,
    });
  },
  async collectWork(uid, id, currentCollectedByList) {
    await updateDoc(doc(this.db(), "works", id), {
      collected_by: [...currentCollectedByList, uid],
    });
  },
  async collectWorkByCategory(uid, collectionMap) {
    await updateDoc(doc(this.db(), "users", uid), {
      collection_map: collectionMap,
    });
  },
  async uncollectWork(uid, id, currentCollectedByList, collctionMap) {
    const newCollectByList = currentCollectedByList.filter((id) => id !== uid);
    await updateDoc(doc(this.db(), "works", id), {
      collected_by: newCollectByList,
    });
    await updateDoc(doc(this.db(), "users", uid), {
      collction_map: collctionMap,
    });
  },
  async addComment(uid, id, content, count) {
    await addDoc(collection(this.db(), `works/${id}/comments`), {
      author_id: uid,
      content: content,
      created_time: Timestamp.fromDate(new Date(Date.now())),
    });
    await updateDoc(doc(this.db(), "works", id), {
      comments_count: count,
    });
  },
  async getLatestComments(id) {
    const queryCondition = query(
      collection(this.db(), `works/${id}/comments`),
      orderBy("created_time", "desc"),
      limit(2)
    );
    const querySnapshot = await getDocs(queryCondition);
    const latestComments = await Promise.all(
      querySnapshot.docs.map(async (item) => {
        const authorInfo = await this.getUserBasicInfo(item.data().author_id);
        return {
          id: item.id,
          ...item.data(),
          ...authorInfo,
        };
      })
    );
    return latestComments;
  },
  async addNewWork(workRef, data) {
    await setDoc(workRef, {
      ...data,
      created_time: Timestamp.fromDate(new Date(Date.now())),
    });
  },
  getNewWorkRef() {
    return doc(this.worksRef());
  },
  async uploadFile(file) {
    const imageRef = ref(getStorage(), `images/${file.name}`);
    await uploadBytes(imageRef, file);
    const imageDownloadURL = await getDownloadURL(imageRef);

    return imageDownloadURL;
  },
  onSnapshotComments(id, callback) {
    const queryCondition = query(
      collection(this.db(), `works/${id}/comments`),
      orderBy("created_time")
    );
    return onSnapshot(queryCondition, callback);
  },
  async getAllTags() {
    const docSnap = await getDoc(this.tagsRef());

    return docSnap.data().tags;
  },
  async updateTags(updateTags) {
    const oldTags = await this.getAllTags();
    const tags = [...new Set([...updateTags, ...oldTags])];
    await setDoc(this.tagsRef(), { tags });
  },
  async getChatrooms() {
    const result = await getDocs(collection(this.db(), "chatrooms"));
    console.log(result);
  },
  onSnapshotChatrooms(uid, callback) {
    const queryCondition = query(
      collection(this.db(), "chatrooms"),
      where("participants", "array-contains", uid)
    );

    return onSnapshot(queryCondition, callback);
  },
  onSnapshotChats(mid, callback) {
    const queryCondition = query(
      collection(this.db(), `chatrooms/${mid}/chats`),
      orderBy("created_time")
    );
    return onSnapshot(queryCondition, callback);
  },
  async addMessage(place, mid, content) {
    const docRef = await addDoc(
      collection(this.db(), `chatrooms/${mid}/chats`),
      {
        sender: place,
        content: content,
        created_time: Timestamp.fromDate(new Date(Date.now())),
        has_read: false,
      }
    );
    await updateDoc(doc(this.db(), `chatrooms/${mid}`), {
      latestMessage: {
        id: docRef.id,
        sender: place,
        content: content,
        created_time: Timestamp.fromDate(new Date(Date.now())),
        has_read: false,
      },
    });
  },
  async getAllUsers(list) {
    const allusers = await getDocs(collection(this.db(), "users"));
    //cool stuff
    const result = allusers.docs
      .filter((user) => !list.includes(user.id))
      .map((user) => {
        return {
          uid: user.id,
          user_name: user.data().user_name,
          user_thumbnail: user.data().user_thumbnail,
        };
      });
    return result;
  },
  async addNewChatroom(id1, id2) {
    const docRef = await addDoc(collection(this.db(), "chatrooms"), {
      participants: [id1, id2],
      latestMessage: {
        created_time: Timestamp.fromDate(new Date(Date.now())),
      },
    });
    return docRef.id;
  },
  async getLatestMessage(mid) {
    const queryCondition = query(
      collection(this.db(), `chatrooms/${mid}/chats`),
      orderBy("created_time", "desc"),
      limit(1)
    );
    const docRef = await getDocs(queryCondition);
    const data = docRef.docs[0]?.data();
    const id = docRef.docs[0]?.id;

    return { id: id, ...data };
  },
  async updateLatestMessage(mid, latestMessage) {
    const docRef = doc(this.db(), `chatrooms/${mid}/chats/${latestMessage.id}`);
    await updateDoc(docRef, { has_read: true });

    await updateDoc(doc(this.db(), `chatrooms/${mid}`), {
      latestMessage: {
        ...latestMessage,
        has_read: true,
      },
    });
  },
  onSnapshotLatestMessage(mid, callback) {
    const queryCondition = query(
      collection(this.db(), `chatrooms/${mid}/chats`),
      orderBy("created_time", "desc"),
      limit(1)
    );
    return onSnapshot(queryCondition, callback);
  },
  async followUser(uid, userID, userList) {
    const uList = await this.getFollowingList(uid);

    if (uList.includes(userID)) return;

    await updateDoc(doc(this.db(), `users/${uid}`), {
      following: [...uList, userID],
    });
    await updateDoc(doc(this.db(), `users/${userID}`), {
      followers: [...userList, uid],
    });
  },
  async unfollowUser(uid, userID, userList) {
    const uList = await this.getFollowingList(uid);
    const newList = uList.filter((id) => id !== userID);

    await updateDoc(doc(this.db(), `users/${uid}`), {
      following: newList,
    });

    const newUserList = userList.filter((id) => id !== uid);
    await updateDoc(doc(this.db(), `users/${userID}`), {
      followers: newUserList,
    });
  },
  async getChatroom(id1, id2) {
    const result = await getDocs(collection(this.db(), "chatrooms"));

    const target = result.docs.filter((doc) => {
      return (
        doc.data().participants?.includes(id1) &&
        doc.data().participants?.includes(id2)
      );
    });

    if (target.length !== 0) return target[0]?.id;

    const newRoom = await this.addNewChatroom(id1, id2);

    return newRoom;
  },
  async getChatroomInfo(mid, uid) {
    const chatroomData = await getDoc(doc(this.db(), "chatrooms", mid));
    const sender = {};
    chatroomData.data().participants?.forEach((id, i) => {
      if (id !== uid) {
        sender.place = i;
        sender.id = id;
      }
    });
    const senderInfo = await this.getUserBasicInfo(sender.id);

    return {
      ...senderInfo,
      author_id: sender.id,
      author_place: sender.place,
    };
  },
  async checkChatroomParticipants(mid, uid) {
    const chatroom = await getDoc(doc(this.db(), "chatrooms", mid));
    const result = chatroom.data().participants.includes(uid);
    return result;
  },
};

// Firebase.checkChatroomParticipants(
//   "DpGeGkrZpWMsUtz0Uxkv",
//   "oWhlyRTSEMPFknaRnA5MNNB8iZC2"
// ).then((data) => console.log(data));

export { Firebase };
