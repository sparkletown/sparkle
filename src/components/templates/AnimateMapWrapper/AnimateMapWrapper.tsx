import React, { Fragment, useEffect, useRef, useState } from "react";
import { useStore } from "react-redux";

import {
  enterAnimateMapFireBarrel,
  exitAnimateMapFireBarrel, setAnimateMapFireBarrel,
  setAnimateMapFirstEntrance, setAnimateMapLastZoom, setAnimateMapPointer, setAnimateMapRoom,
  setAnimateMapUsers, setAnimateMapZoom,
  updateAnimateMapFireBarrel
} from "store/actions/AnimateMap";

import { Room } from "types/rooms";
import { User } from "types/User";
import { Point } from "types/utility";
import { AnimateMapVenue } from "types/venues";

import { WithId } from "utils/id";

import { useDispatch } from "hooks/useDispatch";

import { ReplicatedUser } from "../../../store/reducers/AnimateMap";
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
  const [dataProvider, setDataProvider] = useState<CloudDataProvider | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const store = useStore();

  const dispatch = useDispatch();

  const handleSetAnimateMapFirstEntrance = (firstEntrance: string) => {
    store.dispatch(setAnimateMapFirstEntrance(firstEntrance));
  };
  const handleSetAnimateMapUsers = (users: Map<string, ReplicatedUser>) => {
    store.dispatch(setAnimateMapUsers(users));
  }
  const handleSetAnimateMapRoom = (room: Room) => {
    store.dispatch(setAnimateMapRoom(room));
  }
  const handleSetAnimateMapFireBarrel = (firebarrelId: string) => {
    store.dispatch(setAnimateMapFireBarrel(firebarrelId));
  }
  const handleSetAnimateMapPointer = (pointer: Point) => {
    store.dispatch(setAnimateMapPointer(pointer));
  }
  const handleSetAnimateMapZoom = (value: number) => {
    store.dispatch(setAnimateMapZoom(value));
  }
  const handleSetAnimateMapLastZoom = (lastZoom: number) => {
    store.dispatch(setAnimateMapLastZoom(lastZoom));
  }

  useEffect(() => {
    if (game || !dataProvider || !containerRef || !containerRef.current) {
      return;
    }

    const config = props.space.gameOptions
      ? new GameConfig(props.space.gameOptions)
      : configs.animateMap;

    // const gameInstance = new GameInstance(
    //   config,
    //   store,
    //   dataProvider,
    //   containerRef.current as HTMLDivElement
    // );

    const gameInstance = new GameInstance({
      config,
      dataProvider,
      containerElement: containerRef.current,
      handleSetAnimateMapFirstEntrance,
      handleSetAnimateMapUsers,
      handleSetAnimateMapRoom,
      handleSetAnimateMapFireBarrel,
      handleSetAnimateMapPointer,
      handleSetAnimateMapZoom,
      handleSetAnimateMapLastZoom,
      animatemap: store.getState().animatemap
    });

    console.log("get store => ", store.getState());

    setGame(gameInstance);
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataProvider]);

  const updateAnimateMapFireBarrelDispatch = (roomId: string, userList: User[]) => {
    dispatch(updateAnimateMapFireBarrel(roomId, userList));
  };

  const onConnectFirebarrelChange = (roomId: string, userList: User[], isConnected: boolean) => {
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
