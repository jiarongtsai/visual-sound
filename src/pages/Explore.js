import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { Firebase } from "../utils/firebase";
import Header from "../components/Header";
export default function Explore() {
  const [exploreworks, setExploreworks] = useState([]);
  useEffect(() => {
    const getProfile = async () => {
      const works = await getDocs(collection(Firebase.db(), "works"));
      setExploreworks(works.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getProfile();
  }, []);

  return (
    <>
      <Header />
      <div>Explore</div>
      <input />
      <button>Search</button>
      {exploreworks.map((work) => {
        return <div key={work.id}>Video</div>;
      })}
    </>
  );
}
