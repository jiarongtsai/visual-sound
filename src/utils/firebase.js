import { initializeApp } from "firebase/app";
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
  db() {
    return getFirestore(this.app);
  },
  worksRef() {
    return collection(this.db(), "works");
  },
  tagsRef() {
    return doc(this.db(), "tags", "BprzcEpU3l2hdnlvJQde");
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

    return docSnap.data().following;
  },
  async getFollowingWorks(id) {
    const followingList = await this.getFollowingList(id);
    const queryCondition = query(
      this.worksRef(),
      where("author_id", "in", followingList),
      orderBy("created_time", "desc"),
      limit(20)
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
        ...doc.data,
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
};

export { Firebase };
