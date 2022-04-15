import { useState, useEffect } from "react";
import styled from "styled-components";
import { Firebase } from "../utils/firebase";
import { PlayerProvider } from "../components/PlayerProvider";
import SequencePlayer from "../components/SequencePlayer";

const Img = styled.img`
  width: 50px;
  border-radius: 50%;
`;

const Div = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

export default function Community() {
  const [allworks, setAllworks] = useState([]);
  useEffect(() => {
    Firebase.getAllworks().then((data) => setAllworks(data));
  }, []);

  return (
    <>
      {allworks.map((work, i) => {
        return (
          <div
            key={i}
            style={{ width: "70vw", padding: "0 2rem", margin: "2rem auto" }}
          >
            <Div>
              <Img src={work.author_thumbnail} />
              <p>{work.author_name}</p>
            </Div>
            <PlayerProvider>
              {({ soundPlayer }) => {
                return (
                  <SequencePlayer
                    player={soundPlayer}
                    sheetmusic={work.sheetmusic}
                    bpm={work.bpm}
                  />
                );
              }}
            </PlayerProvider>
            <div>
              <span>❤️</span>
              <span>💬</span>
              <span>⭐️</span>
            </div>
            <Div>
              <h3>{work.author_name}</h3>
              <p>{work.description}</p>
            </Div>
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
