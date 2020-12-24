import React, { useRef, useEffect, useState, useMemo } from "react";
import * as PIXI from "pixi.js";
import * as Filters from "pixi-filters";

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
import { PartyMapRoomData } from "types/PartyMapRoomData";

type Props = {
  user: WithId<User>;
  venue: PartyMapVenue;
  setSelectedRoom: (room?: PartyMapRoomData) => void;
  setIsRoomModalOpen: (value: boolean) => void;
};

export const CanvasMap: React.FC<Props> = ({
  user,
  venue,
  setSelectedRoom,
  setIsRoomModalOpen,
}) => {
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

    const charm = new Charm(PIXI);

    const backgroundSprite = new PIXI.Sprite();
    const roomSprites: [PIXI.Sprite, () => void][] = [];

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
      bgImageSprite.scale.set(imageScale, imageScale);

      backgroundSprite.addChild(bgImageSprite);

      venue.rooms?.forEach((room) => {
        const roomSprite = new PIXI.Sprite();

        const roomImageURL = `https://cors-anywhere.herokuapp.com/${room.image_url}`;

        const img = new Image();
        img.crossOrigin = "";
        img.src = roomImageURL;
        img.onload = () => {
          const roomImageBackgroundTexture = PIXI.Texture.from(
            `https://cors-anywhere.herokuapp.com/${room.image_url}`
          );

          roomImageBackgroundTexture.baseTexture.setRealSize(
            ((bgImageTexture.baseTexture.width * room.width_percent) / 100) *
              imageScale,
            ((bgImageTexture.baseTexture.height * room.height_percent) / 100) *
              imageScale
          );

          const roomImageBackgroundSprite = PIXI.Sprite.from(
            roomImageBackgroundTexture
          );

          roomSprite.name = room.title;

          roomSprite.x =
            ((bgImageTexture.baseTexture.width * room.x_percent) / 100) *
            imageScale;
          roomSprite.y =
            ((bgImageTexture.baseTexture.height * room.y_percent) / 100) *
            imageScale;

          const style = new PIXI.TextStyle({
            fill: "white",
            fontFamily: "Helvetica",
            fontSize: 23,
            fontVariant: "small-caps",
            fontWeight: "200",
            letterSpacing: 1,
            lineJoin: "bevel",
          });

          const text = new PIXI.Text(room.title, style);
          text.roundPixels = true;

          text.position.set(
            roomImageBackgroundTexture.baseTexture.width * 0.5,
            roomImageBackgroundTexture.baseTexture.height * 0.66
          );
          text.anchor.set(0.5, 0.5);

          roomSprite.interactive = true;
          roomSprite.buttonMode = true;
          roomSprite.on("click", (event: any) => {
            setSelectedRoom(room);
            setIsRoomModalOpen(true);
          });

          roomSprite.anchor.set(0.5, 0.5);

          roomSprite.addChild(roomImageBackgroundSprite);
          roomSprite.addChild(text);

          roomSprite.on("mouseover", () => {
            roomSprite.filters = [new Filters.OutlineFilter(2, 0xffffff)];
          });

          roomSprite.on("mouseout", () => {
            roomSprite.filters = [];
          });

          roomSprites.push([
            roomSprite,
            () => {
              setSelectedRoom(room);
              setIsRoomModalOpen(true);
            },
          ]);

          newApp.stage.addChild(roomSprite);
        };
      });
    };

    // const rectangle = PIXI.Sprite.from(PIXI.Texture.WHITE);
    // rectangle.width = 300;
    // rectangle.height = 200;
    // rectangle.x = 60;
    // rectangle.y = 60;
    // rectangle.tint = 0xff0000;
    // roomSprites.push([rectangle, () => {}]);
    // newApp.stage.addChild(rectangle);

    const player = createPlayer({
      id: user.id,
      userProfile: user,
      onCreated: (child) => newApp.stage.addChild(child),
      isMe: true,
    });

    const checkCollisionPlace = (
      a: PIXI.Rectangle,
      b: PIXI.Rectangle
    ): boolean => {
      return (
        a.x + a.width > b.x &&
        a.x < b.x + b.width &&
        a.y + a.height > b.y &&
        a.y < b.height + b.y
      );
    };

    const makeOnIntersectCallback = (
      player: PIXI.Sprite,
      venue: PIXI.Sprite,
      callback: () => void
    ) => {
      const playerBox = player.getBounds();

      const venueBox = venue.getBounds();
      const collision = checkCollisionPlace(playerBox, venueBox);

      if (collision) {
        callback();

        player.position.set(5, 5);
      }
    };

    const startGame = () => {
      on("KeyW", () => (player.y -= 3));
      on("KeyS", () => (player.y += 3));
      on("KeyD", () => (player.x += 3));
      on("KeyA", () => (player.x -= 3));

      roomSprites.forEach(([room, callback]) =>
        makeOnIntersectCallback(player, room, callback)
      );

      charm.update();

      requestAnimationFrame(startGame);
    };

    startGame();

    divElement.appendChild(newApp.view);
    appRef.current = {
      app: newApp,
      charm,
    };

    // const updatePositionIntervalId = setInterval(() => {
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
