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
import { PartyMapVenue } from "types/PartyMapVenue";
import { hitTestRectangle, createPlayer } from "./utils";
import * as S from "./styles";

type Props = {
  user: WithId<User>;
  venue: PartyMapVenue;
};

export const CanvasMap: React.FC<Props> = ({ user, venue }) => {
  const firestore = useFirestore();
  const on = useKeysListeners();

  const divElementRef = useRef<HTMLDivElement>(null);
  const [backgroundImageHeight, setBackgroundImageHeight] = useState("100%");
  const appRef = useRef<{ app: PIXI.Application; charm: Charm } | null>(null);

  useEffect(() => {
    const divElement = divElementRef.current;
    if (!divElement) return;

    const newApp = new PIXI.Application({
      resizeTo: divElement as HTMLElement,
      backgroundColor: 0xffffe5,
    });

    const backgroundSprite = new PIXI.Sprite();

    newApp.stage.addChild(backgroundSprite);

    const img = new Image();
    img.crossOrigin = "";
    img.src = `https://cors-anywhere.herokuapp.com/${venue.mapBackgroundImageUrl}`;
    img.onload = () => {
      const bgImageTexture = PIXI.Texture.from(img);
      const imageScale =
        divElement.offsetWidth / bgImageTexture.baseTexture.width;

      setBackgroundImageHeight(
        `${bgImageTexture.baseTexture.height * imageScale}px`
      );

      window.dispatchEvent(new Event("resize"));
      const bgImageSprite = PIXI.Sprite.from(bgImageTexture);
      bgImageSprite.scale.x = imageScale;
      bgImageSprite.scale.y = imageScale;

      backgroundSprite.addChild(bgImageSprite);

      venue.rooms?.forEach((room) => {
        const roomSprite = PIXI.Sprite.from(
          `https://cors-anywhere.herokuapp.com/${room.image_url}`
        );

        roomSprite.name = room.title;

        roomSprite.height =
          ((bgImageTexture.baseTexture.height * room.height_percent) / 100) *
          imageScale;
        roomSprite.width =
          ((bgImageTexture.baseTexture.width * room.width_percent) / 100) *
          imageScale;

        roomSprite.x =
          ((bgImageTexture.baseTexture.width * room.x_percent) / 100) *
          imageScale;
        roomSprite.y =
          ((bgImageTexture.baseTexture.height * room.y_percent) / 100) *
          imageScale;

        roomSprite.interactive = true;
        roomSprite.buttonMode = true;
        // roomSprite.hitArea = new PIXI.Rectangle(0, 0, 100, 100);
        roomSprite.on("click", (event: any) => console.log(event));

        newApp.stage.addChild(roomSprite);
      });
    };

    const player = createPlayer({
      id: user.id,
      userProfile: user,
      onCreated: (child) => newApp.stage.addChild(child),
      isMe: true,
    });

    const charm = new Charm(PIXI);

    const startGame = () => {
      on("KeyW", () => (player.y -= 3));
      on("KeyS", () => (player.y += 3));
      on("KeyD", () => (player.x += 3));
      on("KeyA", () => (player.x -= 3));

      charm.update();

      requestAnimationFrame(startGame);
    };

    startGame();

    console.log(venue.rooms);

    divElement.appendChild(newApp.view);
    appRef.current = {
      app: newApp,
      charm,
    };

    // setInterval(() => {
    //   firestore
    //     .collection("venues")
    //     .doc(venue.name)
    //     .collection("onlinePlayers")
    //     .doc(user.id)
    //     .set({
    //       x: player.x,
    //       y: player.y,
    //     });
    // }, 200);
  }, []);

  useFirestoreConnect({
    collection: "venues",
    doc: venue.name,
    subcollections: [{ collection: "onlinePlayers" }],
    storeAs: "onlinePlayers",
  });

  const allPlayers = useSelector((state) => state.firestore.data.onlinePlayers);

  const usersById = useUsersById();

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
          userProfile: usersById[userId],
        });
      }
    }
  }, [appRef.current, allPlayers]);

  return (
    <S.Container>
      <S.Canvas height={backgroundImageHeight} ref={divElementRef} />
      <S.SidebasePlace />
      <Sidebar />
    </S.Container>
  );
};
