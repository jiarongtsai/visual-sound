import React from "react";
import Sequencer from "../components/squencer/sequencer";
import PlayerProvider from "../components/squencer/player-provider";

export default function TonePlayer() {
  return (
    <PlayerProvider>
      {({ player }) => {
        return <Sequencer player={player} />;
      }}
    </PlayerProvider>
  );
}
