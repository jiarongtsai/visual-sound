import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../components/auth/Auth";
import { Firebase } from "../utils/firebase";

export default function CollectWithCategory({ id, collectedList }) {
  const user = useContext(AuthContext);
  const [collectionData, setCollectionData] = useState({});
  const [selection, setSelection] = useState("");
  const [collect, setCollect] = useState(false);

  useEffect(() => {
    Firebase.getProfile(user?.uid).then((data) => {
      setCollectionData(data.collection_map);
    });

    setCollect(collectedList?.includes(user.uid) ? true : false);
  }, []);

  async function collectWork() {
    if (!collect) {
      await Firebase.collectWork(user.uid, id, collectedList);

      if (selection) {
        const collectionCopy = { ...collectionData };
        collectionCopy[selection]
          ? collectionCopy[selection].push(id)
          : (collectionCopy[selection] = [id]);
        await Firebase.collectWorkByCategory(user.uid, collectionCopy);
      }

      setSelection("");
    } else {
      const collectionCopy = { ...collectionData };
      console.log(collectionCopy);
      const removedCollectionData = removeCollectionByID(collectionCopy, id);
      console.log(removedCollectionData);
      await Firebase.uncollectWork(
        user.uid,
        id,
        collectedList,
        removedCollectionData
      );
      setCollectionData(removedCollectionData);
    }

    setCollect(!collect);
  }

  function removeCollectionByID(obj, id) {
    const result = {};

    for (const [key, value] of Object.entries(obj)) {
      const index = value.findIndex((v) => v === id);
      if (index >= 0) {
        value.splice(index, 1);
      }
      result[key] = value;
    }

    return result;
  }

  return (
    <div>
      <input
        list="category"
        value={selection}
        onChange={(e) => setSelection(e.target.value)}
      />
      <datalist id="category">
        {collectionData &&
          Object.keys(collectionData).map((term) => (
            <option key={term} value={term}>
              {term}
            </option>
          ))}
      </datalist>
      <button onClick={collectWork}>{`${
        collect ? "collected" : "collect"
      }`}</button>
    </div>
  );
}
