import React from "react";
import { Container } from "@chakra-ui/react";
import MySequencer from "../components/squencer/MySequencer";
import { PlayerProvider } from "../components/PlayerProvider";

export default function Main() {
  return (
    <Container mt={16}>
      <PlayerProvider>
        {({ soundPlayer }) => {
          return <MySequencer player={soundPlayer} />;
        }}
      </PlayerProvider>
    </Container>
  );
}
