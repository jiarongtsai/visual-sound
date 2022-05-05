import React from "react";
import MySequencer from "../components/squencer/MySequencer";
import { PlayerProvider } from "../components/PlayerProvider";

export default function Main() {
  return (
    <PlayerProvider>
      {({ soundPlayer }) => <MySequencer player={soundPlayer} />}
    </PlayerProvider>
  );
}
