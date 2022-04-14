import { React } from "react";
import MySequencer from "../components/squencer/MySequencer";
import Header from "../components/Header";
import { PlayerProvider } from "../components/PlayerProvider";

export default function Main() {
  return (
    <>
      <Header />
      <PlayerProvider>
        {({ soundPlayer }) => {
          return <MySequencer player={soundPlayer} />;
        }}
      </PlayerProvider>
    </>
  );
}
