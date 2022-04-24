import React from "react";
import MySequencer from "../components/squencer/MySequencer";
import { PlayerProvider } from "../components/PlayerProvider";

export default function Main() {
  return (
    <>
      <PlayerProvider>
        {({ soundPlayer }) => {
          return <MySequencer player={soundPlayer} />;
        }}
      </PlayerProvider>
    </>
  );
}
