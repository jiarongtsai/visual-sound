import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
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
  pageLimit: 12,
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

    await updateProfile(user, {
      displayName: username,
      photoURL: `https://joeschmoe.io/api/v1/${username}`,
    });

    const currentUser = await this.addNewUser(user);
    return currentUser;
  },
  async updateProfile(user, name, bio, thumbnail) {
    await updateProfile(user, {
      displayName: name,
      photoURL: thumbnail,
    });
    await updateDoc(doc(this.db(), "users", user.uid), {
      user_name: name,
      user_bio: bio,
      user_thumbnail: thumbnail,
    });
  },
  async login(email, password) {
    const userCredential = await signInWithEmailAndPassword(
      this.auth(),
      email,
      password
    );
    return userCredential.user;
  },
  async getWorks(lastVisibleData, term, uid) {
    let queryCondition;
    if (term) {
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
    } else if (uid) {
      if (lastVisibleData) {
        queryCondition = query(
          this.worksRef(),
          where("author_id", "==", uid),
          orderBy("created_time", "desc"),
          startAfter(lastVisibleData),
          limit(this.pageLimit)
        );
      } else {
        queryCondition = query(
          this.worksRef(),
          where("author_id", "==", uid),
          orderBy("created_time", "desc"),
          limit(this.pageLimit)
        );
      }
    } else {
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
    }

    const snapshot = await getDocs(queryCondition);

    let fetchWorks;

    if (uid) {
      fetchWorks = snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
    } else {
      fetchWorks = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const userInfo = await this.getUserBasicInfo(doc.data().author_id);
          return {
            id: doc.id,
            ...doc.data(),
            ...userInfo,
          };
        })
      );
    }

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
  async getRelatedWorks(uid, tags) {
    const queryCondition = query(
      this.worksRef(),
      where("author_id", "==", uid),
      limit(6)
    );
    const snapshot = await getDocs(queryCondition);

    const authorResult = snapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });

    if ((authorResult.length = 6)) return authorResult;

    const TagsQueryCondition = query(
      this.worksRef(),
      where("tags", "array-contains", tags),
      limit(6 - authorResult.length)
    );
    const tagSnapshot = await getDocs(TagsQueryCondition);
    const TagsResult = tagSnapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });

    return [...authorResult, ...TagsResult];
  },
  async getRecommendFollower(id) {
    const list = await this.getFollowingList(id);
    list.push(id);
    const recommendUser = await this.getAllUsers(list);

    return recommendUser.slice(0, 6);
  },
  async getFollowingList(id) {
    const docRef = doc(this.db(), "users", id);
    const docSnap = await getDoc(docRef);

    return docSnap.data()?.following;
  },
  async getFollowersList(id) {
    const docRef = doc(this.db(), "users", id);
    const docSnap = await getDoc(docRef);

    return docSnap.data()?.followers;
  },
  async getFollowingWorks(id) {
    const followingList = await this.getFollowingList(id);

    if (!followingList || followingList.length === 0) return [];

    if (followingList.length <= 10)
      return this.getUnderTenFollowingsWorks(followingList);

    const splitFollowingList = [];
    while (followingList.length) {
      splitFollowingList.push(followingList.splice(0, 10));
    }

    const allFollowingWorkPromise = [];

    splitFollowingList.forEach((list) => {
      const result = this.getUnderTenFollowingsWorks(list);
      allFollowingWorkPromise.push(result);
    });

    const dataArray = await Promise.all(allFollowingWorkPromise);
    //cool: search about flat() function
    const sortedFollowingWorks = dataArray.flat().sort((a, b) => {
      return b.created_time.seconds - a.created_time.seconds;
    });

    return sortedFollowingWorks;
  },
  async snapshotFollowingWorks(uid, callback) {
    const followingList = await this.getFollowingList(uid);

    if (!followingList || followingList.length === 0) return [];

    if (followingList.length <= 10) {
      this.snapshotUnderTenFollowingWorks(followingList, callback);
      return;
    }

    const splitFollowingList = [];

    while (followingList.length) {
      splitFollowingList.push(followingList.splice(0, 10));
    }

    for (const list of splitFollowingList) {
      this.snapshotUnderTenFollowingWorks(list, callback);
    }
  },
  snapshotUnderTenFollowingWorks(list, callback) {
    const queryCondition = query(
      this.worksRef(),
      where("author_id", "in", list),
      orderBy("created_time", "desc")
    );
    const snapshot = onSnapshot(queryCondition, (docs) => {
      docs.forEach((doc) => {
        callback({ ...doc.data(), id: doc.id });
      });
    });

    return snapshot;
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
  onSnapshotProfile(id, callback) {
    const docRef = doc(this.db(), "users", id);
    const snapshot = onSnapshot(docRef, (doc) => {
      callback(doc.data());
    });

    return snapshot;
  },
  async getUserWorks(uid) {
    const queryByUser = query(
      collection(this.db(), "works"),
      where("author_id", "==", uid),
      orderBy("created_time", "desc")
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
  snapshotWork(id, callback) {
    const docRef = doc(this.db(), "works", id);
    const snapshot = onSnapshot(docRef, async (doc) => {
      const authorInfo = await this.getUserBasicInfo(doc.data().author_id);
      callback({ ...doc.data(), id: doc.id, ...authorInfo });
    });
    return snapshot;
  },
  async likeWork(id, updatedLikedByList) {
    await updateDoc(doc(this.db(), "works", id), {
      liked_by: updatedLikedByList,
    });
  },
  async unlikeWork(id, updatedLikedByList) {
    await updateDoc(doc(this.db(), "works", id), {
      liked_by: updatedLikedByList,
    });
  },
  async collectWork(id, updatedCollectedByList) {
    await updateDoc(doc(this.db(), "works", id), {
      collected_by: updatedCollectedByList,
    });
  },
  async collectWorkByCategory(uid, collectionMap) {
    await updateDoc(doc(this.db(), "users", uid), {
      collection_map: collectionMap,
    });
  },
  async uncollectWork(id, updatedCollectedByList, uid, updatedCollectionMap) {
    await updateDoc(doc(this.db(), "works", id), {
      collected_by: updatedCollectedByList,
    });
    await updateDoc(doc(this.db(), "users", uid), {
      collection_map: updatedCollectionMap,
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
    const userInfo = await this.getProfile(data.author_id);
    const count = (userInfo.works_count || 0) + 1;
    await updateDoc(doc(this.db(), "users", data.author_id), {
      works_count: count,
    });
    await setDoc(workRef, {
      ...data,
      created_time: Timestamp.fromDate(new Date(Date.now())),
    });
  },
  getNewWorkRef() {
    return doc(this.worksRef());
  },
  async uploadFile(file, place) {
    const imageRef = ref(getStorage(), `${place}/${file.name}`);
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
  async updateTags(tags) {
    await setDoc(this.tagsRef(), { tags });
  },
  async getChatrooms() {
    await getDocs(collection(this.db(), "chatrooms"));
  },
  onSnapshotChatrooms(uid, callback) {
    const queryCondition = query(
      collection(this.db(), "chatrooms"),
      where("participants", "array-contains", uid)
    );

    return onSnapshot(queryCondition, async (snapshot) => {
      const promises = [];

      snapshot.docs.forEach((chatroom) => {
        chatroom.data().participants.forEach((id, i) => {
          const promise = Firebase.getUserBasicInfo(id).then((senderInfo) => {
            return {
              ...senderInfo,
              author_place: i,
              mid: chatroom.id,
              latestMessage: chatroom.data().latestMessage,
            };
          });

          if (id !== uid) promises.push(promise);
        });
      });
      const allchatrooms = await Promise.all(promises);

      const sortedByTime = allchatrooms.sort((a, b) => {
        return (
          b.latestMessage.created_time.seconds -
          a.latestMessage.created_time.seconds
        );
      });

      callback(sortedByTime);
    });
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
          author_id: user.id,
          author_name: user.data().user_name,
          author_thumbnail: user.data().user_thumbnail,
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
  async followUser(senderID, receiverID) {
    const senderFollowingList = await this.getFollowingList(senderID);
    if (senderFollowingList.includes(receiverID)) return;
    //fixme maybe ?????????????????????
    const receiverFollowersList = await this.getFollowersList(receiverID);
    await updateDoc(doc(this.db(), `users/${senderID}`), {
      following: [...senderFollowingList, receiverID],
    });
    await updateDoc(doc(this.db(), `users/${receiverID}`), {
      followers: [...receiverFollowersList, senderID],
    });
  },
  async unfollowUser(senderID, receiverID) {
    const senderFollowingList = await this.getFollowingList(senderID);
    const receiverFollowersList = await this.getFollowersList(receiverID);

    await updateDoc(doc(this.db(), `users/${senderID}`), {
      following: senderFollowingList.filter((id) => id !== receiverID),
    });
    await updateDoc(doc(this.db(), `users/${receiverID}`), {
      followers: receiverFollowersList.filter((id) => id !== senderID),
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
