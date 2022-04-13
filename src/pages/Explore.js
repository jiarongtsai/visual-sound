import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import db from "../utils/firebase-config";
import Header from "../components/Header";
export default function Explore() {
  const [exploreworks, setExploreworks] = useState([]);
  useEffect(() => {
    const getProfile = async () => {
      const works = await getDocs(collection(db, "works"));
      setExploreworks(works.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getProfile();
  }, []);

  return (
    <>
      <Header />
      <div>Explore</div>
      {exploreworks.map((work) => {
        return (
          <div key={work.id}>
            <video
              width="400"
              height="200"
              controls
              src="https://media.geeksforgeeks.org/wp-content/uploads/20190616234019/Canvas.move_.mp4"
            >
              Browser not supported
            </video>{" "}
          </div>
        );
      })}
    </>
  );
}
