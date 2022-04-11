import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import db from "../utils/firebase-config";

export default function Explore() {
  useEffect(() => {
    const getProfile = async () => {
      const works = await getDocs(collection(db, "works"));
      works.forEach((doc) => {
        console.log(doc.id, doc.data());
      });
    };
    getProfile();
  }, []);

  return (
    <>
      <div>Explore</div>
    </>
  );
}
