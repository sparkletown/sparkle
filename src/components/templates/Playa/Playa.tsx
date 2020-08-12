import React from "react";
import { PlayaContextProvider } from "./Context";
import { Container } from "./components/Container";
import { Map } from "./components/Map";
import { UI } from "./components/UI";

import "./Playa.scss";

export const Playa = () => {
  return (
    <PlayaContextProvider>
      <Container>
        <Map />
        <UI />
      </Container>
    </PlayaContextProvider>
  );
};
