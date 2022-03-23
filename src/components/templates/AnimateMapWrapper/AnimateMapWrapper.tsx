import React, { Fragment, useEffect, useRef, useState } from "react";
import { useStore } from "react-redux";

import {
  enterAnimateMapFireBarrel,
  exitAnimateMapFireBarrel,
  updateAnimateMapFireBarrel,
} from "store/actions/AnimateMap";

import { User } from "types/User";
import { AnimateMapVenue } from "types/venues";

import { WithId } from "utils/id";

import { useDispatch } from "hooks/useDispatch";

import { AnimateMap } from "../AnimateMap";
import { CloudDataProviderWrapper } from "../AnimateMap/bridges/CloudDataProviderWrapper";
import { CloudDataProvider } from "../AnimateMap/bridges/DataProvider/CloudDataProvider";
import { configs } from "../AnimateMap/configs";
import { GameConfig } from "../AnimateMap/configs/GameConfig";
import { GameInstance } from "../AnimateMap/game/GameInstance";
import { useRelatedPartymapRooms } from "../AnimateMap/hooks/useRelatedPartymapRooms";

export type AnimateMapWrapperProps = {
  space: WithId<AnimateMapVenue>;
};

export const AnimateMapWrapper: React.VFC<AnimateMapWrapperProps> = (props) => {
  const [game, setGame] = useState<GameInstance | null>(null);
  const relatedRooms = useRelatedPartymapRooms({ venue: props.space });
  const [showFirebarrelFlag, setShowFirebarrelFlag] = useState(false);
  const [dataProvider, setDataProvider] = useState<CloudDataProvider | null>(
    null
  );

  const containerRef = useRef<HTMLDivElement>(null);

  const store = useStore();

  const dispatch = useDispatch();

  useEffect(() => {
    if (game || !dataProvider || !containerRef || !containerRef.current) {
      return;
    }

    const config = props.space.gameOptions
      ? new GameConfig(props.space.gameOptions)
      : configs.animateMap;

    const gameInstance = new GameInstance(
      config,
      store,
      dataProvider,
      containerRef.current as HTMLDivElement
    );

    setGame(gameInstance);
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataProvider]);

  const updateAnimateMapFireBarrelDispatch = (
    roomId: string,
    userList: User[]
  ) => {
    dispatch(updateAnimateMapFireBarrel(roomId, userList));
  };

  const onConnectFirebarrelChange = (
    roomId: string,
    userList: User[],
    isConnected: boolean
  ) => {
    if (isConnected) {
      dispatch(enterAnimateMapFireBarrel(roomId, userList));
    } else {
      dispatch(exitAnimateMapFireBarrel(roomId));
    }

    setShowFirebarrelFlag(isConnected);
  };

  return (
    <Fragment>
      <AnimateMap
        updateAnimateMapFireBarrelDispatch={updateAnimateMapFireBarrelDispatch}
        onConnectFirebarrelChange={onConnectFirebarrelChange}
        showFirebarrelFlag={showFirebarrelFlag}
        game={game}
        containerRef={containerRef}
        {...props}
      />
      <CloudDataProviderWrapper
        venue={props.space}
        newDataProviderCreate={setDataProvider}
        relatedRooms={relatedRooms}
        reInitOnError={void 0}
      />
    </Fragment>
  );
};
