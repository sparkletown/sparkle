import React from "react";

import { SpaceWithId } from "types/id";

// import styles from "./Splash.module.scss";

type SplashSpaceProps = {
  space: SpaceWithId;
};

export const SplashSpace: React.FC<SplashSpaceProps> = ({ space }) => {
  return <div>Splash page!</div>;
};
