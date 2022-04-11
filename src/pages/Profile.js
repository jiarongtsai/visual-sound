import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import db from "../utils/firebase-config";

export default function Profile() {
  useEffect(() => {
    const getProfile = async () => {
      const users = await getDocs(collection(db, "users"));
      users.forEach((doc) => {
        console.log(doc.id, doc.data());
      });
    };
    getProfile();
  }, []);

  return <div>Profile</div>;
}
