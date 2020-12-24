import React, { useRef, useEffect, useState, useMemo } from "react";
import * as PIXI from "pixi.js";

import { useUsersById } from "hooks/useUsers";
import { useKeysListeners } from "./hooks";
import {
  FirebaseReducer,
  useFirestore,
  useFirestoreConnect,
} from "react-redux-firebase";
import { User } from "types/User";
import { WithId } from "utils/id";
import { useSelector } from "hooks/useSelector";
import { useInterval } from "hooks/useInterval";

import Sidebar from "components/molecules/Sidebar";

import { Charm } from "./charm";
import { DEFAULT_PROFILE_IMAGE } from "settings";
import { PartyMapVenue } from "types/PartyMapVenue";
import { hitTestRectangle } from "./utils";
// import * as S from "./styles";

type Props = {
  user: WithId<User>;
  venue: PartyMapVenue;
};

const venueObjects = [
  { x: 400, y: 100, url: "/venues/pickspace-thumbnail_art.png" },
  { x: 400, y: 500, url: "/venues/pickspace-thumbnail_artcar.png" },
  { x: 600, y: 200, url: "/venues/pickspace-thumbnail_auditorium.png" },
];

const createPlayer = ({
  id,
  x,
  y,
  userProfile,
  onCreated,
  isMe = false,
}: {
  id: string;
  x?: number;
  y?: number;
  userProfile?: User;
  onCreated: (child: PIXI.Sprite) => void;
  isMe?: boolean;
}) => {
  const texture = PIXI.Texture.from(DEFAULT_PROFILE_IMAGE);

  const player = new PIXI.Sprite(texture);

  player.name = id;

  player.height = 45;
  player.width = 45;

  player.x = x ?? 10;
  player.y = y ?? 10;

  player.zIndex = 1;

  onCreated(player);

  return player;
};

export const CanvasMap: React.FC<Props> = ({ user, venue }) => {
  const firestore = useFirestore();
  const on = useKeysListeners();

  const divElement = useRef<HTMLDivElement>(null);
  const appRef = useRef<{ app: PIXI.Application; charm: Charm } | null>(null);

  // console.log(venue.rooms);

  useEffect(() => {
    const containerWidth = divElement.current?.offsetWidth ?? 0;
    const containerHeight = divElement.current?.offsetHeight ?? 0;

    const newApp = new PIXI.Application({
      width: containerWidth,
      height: containerHeight,
      backgroundColor: 0xffffe5,
    });

    // const backgroundImage = PIXI.Sprite.from("/testBg.jpg");
    // backgroundImage.anchor.set(0, 0);
    // backgroundImage.position.set(0, 0);
    // backgroundImage.width = containerWidth;
    // const imageRatio = backgroundImage.width / backgroundImage.height;
    // const containerRatio = containerWidth / containerHeight;

    // backgroundImage.height = containerHeight;
    // backgroundImage.width = containerWidth;
    // backgroundImage.position.x = 0;
    // backgroundImage.position.y = (containerHeight - backgroundImage.height) / 2;

    // newApp.stage.addChild(backgroundImage);

    const player = createPlayer({
      id: user.id,
      // userProfile: user,
      onCreated: (child) => newApp.stage.addChild(child),
      isMe: true,
    });

    const charm = new Charm(PIXI);

    const startGame = () => {
      on("KeyW", () => (player.y -= 3));
      on("KeyS", () => (player.y += 3));
      on("KeyD", () => (player.x += 3));
      on("KeyA", () => (player.x -= 3));

      // venueObjects.forEach(({ url }) => {
      //   if (hitTestRectangle(player, newApp.stage.getChildByName(url))) {
      //     console.log("MAYDAY");
      //   }
      // });

      charm.update();

      requestAnimationFrame(startGame);
    };

    startGame();

    // venueObjects.forEach((obj) => {
    //   const texture = PIXI.Texture.from(obj.url);

    //   const player = new PIXI.Sprite(texture);

    //   player.name = obj.url;

    //   player.height = 150;
    //   player.width = 200;

    //   player.x = obj.x;
    //   player.y = obj.y;
    //   newApp.stage.addChild(player);
    // });

    divElement.current?.appendChild(newApp.view);
    appRef.current = {
      app: newApp,
      charm,
    };

    setInterval(() => {
      firestore
        .collection("venues")
        .doc(venue.name)
        .collection("onlinePlayers")
        .doc(user.id)
        .set({
          x: player.x,
          y: player.y,
        });
    }, 200);
  }, []);

  useFirestoreConnect({
    collection: "venues",
    doc: venue.name,
    subcollections: [{ collection: "onlinePlayers" }],
    storeAs: "onlinePlayers",
  });

  const allPlayers = useSelector((state) => state.firestore.data.onlinePlayers);

  // const usersById = useUsersById();

  useEffect(() => {
    const app = appRef.current?.app;
    const charm = appRef.current?.charm;
    if (!allPlayers || !app || !charm) return;

    for (const userId in allPlayers) {
      if (userId === user.id) continue;

      const existingPlayer = app.stage.getChildByName(userId);
      if (existingPlayer) {
        charm.slide(
          existingPlayer,
          allPlayers[userId].x,
          allPlayers[userId].y,
          10,
          "linear"
        );
      } else {
        createPlayer({
          ...allPlayers[userId],
          id: userId,
          onCreated: (child: PIXI.Sprite) => app.stage.addChild(child),
          // userProfile: usersById[userId],
        });
      }
    }
  }, [appRef.current, allPlayers]);

  return (
    <>
      <div ref={divElement} style={{ height: "100%", width: "100%" }} />
      <Sidebar />
    </>
  );
};
