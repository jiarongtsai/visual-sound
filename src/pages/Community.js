import { useState, useEffect } from "react";
import { collection, getDocs, onSnapshot, doc } from "firebase/firestore";
import db from "../utils/firebase-config";

export default function Community() {
  const [allworks, setAllworks] = useState([]);
  useEffect(() => {
    onSnapshot(collection(db, "works"), (snapShot) => {
      const allSnapWorks = [];
      snapShot.forEach((doc) => {
        allSnapWorks.push(doc.data());
      });
      setAllworks(allSnapWorks);
    });
  }, []);

  return (
    <div>
      {allworks.map((work) => {
        return (
          <div key={work.author.id}>
            <p>{work.author.name}</p>
            <p>{work.description}</p>
          </div>
        );
      })}
    </div>
  );
}
