import { useState, useEffect } from "react";
import styled from "styled-components";
import { collection, onSnapshot, getDoc, doc } from "firebase/firestore";
import db from "../utils/firebase-config";
import Header from "../components/Header";
import { PlayerProvider } from "../components/PlayerProvider";
import SequencePlayer from "../components/SequencePlayer";

const Img = styled.img`
  width: 50px;
  border-radius: 50%;
`;

export default function Community() {
  const [allworks, setAllworks] = useState([]);
  useEffect(() => {
    onSnapshot(collection(db, "works"), (snapShot) => {
      async function promises() {
        const unresolved = snapShot.docs.map(async (docItem) => {
          const docRef = doc(db, "users", docItem.data().author_id);
          const docSnap = await getDoc(docRef);
          return {
            ...docItem.data(),
            id: docItem.id,
            author_name: docSnap.data().user_name,
            author_thumbnail: docSnap.data().user_thumbnail,
          };
        });

        const resolved = await Promise.all(unresolved);
        setAllworks(resolved);
      }

      promises();
    });
  }, []);

  return (
    <>
      <Header />
      {allworks.map((work) => {
        return (
          <div key={work.id}>
            <>
              <Img src={work.author_thumbnail} />
              <p>{work.author_name}</p>
            </>
            <PlayerProvider>
              {({ soundPlayer }) => {
                return <SequencePlayer player={soundPlayer} />;
              }}
            </PlayerProvider>
            <div>
              <span>❤️</span>
              <span>💬</span>
              <span>⭐️</span>
            </div>
            <>
              <h3>{work.author_name}</h3>
              <p>{work.description}</p>
            </>
            <div>
              <>
                {work.commentsLatest &&
                  work.commentsLatest.map((comment) => {
                    return (
                      <div key={work.id}>
                        <span>
                          <strong>{comment.name}</strong>
                        </span>
                        <span>{comment.content}</span>
                      </div>
                    );
                  })}
              </>
              <a href="">{`view all ${work.comments_count} comments`}</a>
            </div>
            <>
              <input name="content" />
              <button>send</button>
            </>
            <p>{work.created_time.toDate().toDateString()}</p>
          </div>
        );
      })}
    </>
  );
}
