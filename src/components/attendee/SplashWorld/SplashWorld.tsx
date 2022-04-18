import React from "react";

import { SpaceWithId } from "types/id";

// import styles from "./SplashWorld.module.scss";

type SplashWorldProps = {
  space: SpaceWithId;
};

export const SplashWorld: React.FC<SplashWorldProps> = ({ space }) => {
  return <div>SplashWorld page!</div>;
};
