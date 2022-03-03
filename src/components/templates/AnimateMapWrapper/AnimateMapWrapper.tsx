import React from 'react';

import { AnimateMapVenue } from "types/venues";

import { WithId } from "utils/id";

import { AnimateMap } from '../AnimateMap';

export type AnimateMapWrapperProps = {
  space: WithId<AnimateMapVenue>;
};

export const AnimateMapWrapper: React.VFC<AnimateMapWrapperProps> = (props) => {
  return (
    <AnimateMap {...props}/>
  );
};
