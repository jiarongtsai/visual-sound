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
} from "firebase/firestore";

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
  db() {
    return getFirestore(this.app);
  },
  worksRef() {
    return collection(this.db(), "works");
  },
  async getAllworks() {
    const queryCondition = query(
      this.worksRef(),
      orderBy("created_time", "desc"),
      limit(20)
    );
    const snapShot = await getDocs(queryCondition);
    const allworks = await Promise.all(
      snapShot.docs.map(async (item) => {
        const userInfo = await this.getUserBasicInfo(item.data().author_id);
        return {
          id: item.id,
          ...item.data(),
          ...userInfo,
        };
      })
    );
    return allworks;
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
  async getUserWorks(id) {
    const queryByUser = query(
      collection(this.db(), "works"),
      orderBy("created_time", "desc"),
      where("author_id", "==", id)
    );
    const querySnapshot = await getDocs(queryByUser);
    const userWorks = querySnapshot.docs.map((doc) => doc.data());

    return userWorks;
  },
  async getWork(id) {
    const docRef = doc(this.db(), "works", id);
    const docSnap = await getDoc(docRef);
    const authorInfo = await this.getUserBasicInfo(docSnap.data().author_id);

    return {
      ...docSnap.data(),
      ...authorInfo,
    };
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
  async addNewWork(data) {
    await addDoc(this.worksRef(), {
      ...data,
      created_time: Timestamp.fromDate(new Date(Date.now())),
    });
  },
  async searchWorks(term) {
    const queryCondition = query(
      this.worksRef(),
      where("tags", "array-contains", term),
      orderBy("created_time", "desc"),
      limit(20)
    );
    const snapshot = await getDocs(queryCondition);
    const result = Promise.all(
      snapshot.docs.map(async (item) => {
        const authorInfo = await this.getUserBasicInfo(item.data().author_id);
        return {
          id: item.id,
          ...item.data(),
          ...authorInfo,
        };
      })
    );
    return result;
  },
};

export { Firebase };
