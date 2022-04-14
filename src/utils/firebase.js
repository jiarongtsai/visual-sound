import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
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
  async getAllworks() {
    const snapShot = await getDocs(collection(this.db(), "works"));
    const allworks = await Promise.all(
      snapShot.docs.map(async (item) => {
        const userInfo = await this.getUserBasicInfo(item.data().author_id);
        return {
          ...item.data(),
          ...userInfo,
        };
      })
    );
    return allworks;
  },
  async getUserBasicInfo(id) {
    const docRef = doc(this.db(), "users", id);
    const docSnap = await getDoc(docRef);

    return {
      id: id,
      author_name: docSnap.data().user_name,
      author_thumbnail: docSnap.data().user_thumbnail,
    };
  },
  async getProfile(id) {
    const docRef = doc(this.db(), "users", id);
    const docSnap = await getDoc(docRef);

    return {
      id: id,
      ...docSnap.data(),
    };
  },
};

export { Firebase };
