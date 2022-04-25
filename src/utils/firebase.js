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
    const followingList = await this.getFollowingList(id);

    if (!followingList || followingList.length === 0) return [];

    //ask if followinglist longer!
    // if (followingList.length > 10) {
    //   const splitFollowingList = [];
    //   while (followingList.length) {
    //     splitFollowingList.push(followingList.splice(0, 10));
    //   }

    //   function getQueryList(arrOfarr) {

    //     for (const list of arrOfarr) {
    //       console.log(typeof where("author_id", "in", list));
    //       return where("author_id", "in", list);
    //     }
    //   }

    //   // const queryCondition = query(
    //   //   this.worksRef(),
    //   //   getQueryList(splitFollowingList),
    //   //   orderBy("created_time", "desc")
    //   // );

    //   console.log(getQueryList(splitFollowingList));
    // }

    const queryCondition = query(
      this.worksRef(),
      where("author_id", "in", followingList),
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
  async uncollectWork(uid, id, currentCollectedByList) {
    const newCollectByList = currentCollectedByList.filter((id) => id !== uid);
    await updateDoc(doc(this.db(), "works", id), {
      collected_by: newCollectByList,
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
    await addDoc(collection(this.db(), `chatrooms/${mid}/chats`), {
      sender: place,
      content: content,
      created_time: Timestamp.fromDate(new Date(Date.now())),
      has_read: false,
    });
    await updateDoc(doc(this.db(), `chatrooms/${mid}`), {
      latestMessage: {
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
};

export { Firebase };
