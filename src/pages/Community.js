import { useState, useEffect } from "react";
import styled from "styled-components";
import { collection, onSnapshot } from "firebase/firestore";
import db from "../utils/firebase-config";

const Img = styled.img`
  width: 50px;
  border-radius: 50%;
`;

export default function Community() {
  const [allworks, setAllworks] = useState([]);
  useEffect(() => {
    onSnapshot(collection(db, "works"), (snapShot) => {
      setAllworks(snapShot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
  }, []);

  return (
    <div>
      {allworks.map((work) => {
        return (
          <div key={work.author.id}>
            <>
              <Img src={`https://joeschmoe.io/api/v1/${work.author.name}`} />
              <p>{work.author.name}</p>
            </>
            <>
              <iframe
                width="560"
                height="315"
                src="https://www.youtube.com/embed/QwwBBZs2rb0"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </>
            <div>
              <span>❤️</span>
              <span>💬</span>
              <span>⭐️</span>
            </div>
            <>
              <h3>{work.author.name}</h3>
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
              <a href="">{`view all ${work.commentsCount} comments`}</a>
            </div>
            <>
              <input name="content" />
              <button>send</button>
            </>
            <p>{work.timestamp.toDate().toDateString()}</p>
          </div>
        );
      })}
    </div>
  );
}
