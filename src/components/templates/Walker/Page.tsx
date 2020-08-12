import React from "react";
import { WalkerContextProvider } from "./Context";
import { Container } from "./components/Container";
import { Map } from "./components/Map";
import { UI } from "./components/UI";

import "./Walker.scss";

export const Page = () => {
  return (
    <WalkerContextProvider>
      <Container>
        <Map />
        <UI />
      </Container>
    </WalkerContextProvider>
  );
};
