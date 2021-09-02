import { uuid } from "uuidv4";

import { ReplicatedArtcar, ReplicatedUser } from "store/reducers/AnimateMap";

import { getRandomInt } from "utils/getRandomInt";

import { Point } from "../../../../../types/utility";
import { getIntByHash } from "../../bridges/DataProvider/Contructor/PlayerIO/utils/getIntByHash";
import { GameConfig } from "../../configs/GameConfig";
import { GameInstance } from "../GameInstance";

import {
  artcars13,
  avatarAccessories,
  avatarCycles,
  avatarHats,
} from "./AssetConstants";

export const stubArtcarsData = () => {
  const users: Array<ReplicatedArtcar> = [];
  const arr = [
    {
      name: "Darth Paul Art Car",
      link: "https://burn.sparklever.se/in/darthpaul",
    },
    {
      name: "Hand Some Art Car",
      link: "https://burn.sparklever.se/in/handsome",
    },
    {
      name: "Lobo de Playa Art Car",
      link: "https://burn.sparklever.se/in/lobodeplaya",
    },
    {
      name: "Send Noods Art Car",
      link: "thttps://burn.sparklever.se/in/sendnoods",
    },
    {
      name: "Arachnia Art Car",
      link: "https://burn.sparklever.se/in/arachnia",
    },
    {
      name: "Silly Lily Art Car",
      link: "https://burn.sparklever.se/in/sillylily",
    },
    {
      name: "Glam Clam Art Car",
      link: "https://burn.sparklever.se/in/glamclam",
    },
    {
      name: "Dragon: The Car Art Car",
      link: "https://burn.sparklever.se/in/dragonthecar",
    },
    { name: "Tri-Honk Art Car", link: "https://burn.sparklever.se/in/trihonk" },
    {
      name: "Caranirvana Art Car",
      link: "https://burn.sparklever.se/in/caranivana",
    },
    {
      name: "Boaty McBoatface Art Car",
      link: "https://burn.sparklever.se/in/interiorcrocodilealligator",
    },
    {
      name: "Interior Crocodile Alligator Art Car",
      link: "https://burn.sparklever.se/in/lobodeplaya",
    },
    {
      name: "Wheely Fish Sticks Art Car",
      link: "https://burn.sparklever.se/in/wheelyfishsticks",
    },
  ];

  const pseudoRandom = {
    seed: 1 / 2147483647,
    next: function () {
      return (this.seed = (this.seed * 16807) % 2147483647);
    },
    nextFloat: function () {
      return (this.next() - 1) / 2147483646;
    },
  };

  const getRandomNumber = (min: number, max: number): number => {
    return Math.floor(pseudoRandom.nextFloat() * (max - min) + min);
  };

  const config = GameInstance.instance.getConfig();
  const innerRadius = config.venuesMainCircleOuterRadius;
  const outerRadius = config.borderRadius;
  const worldCenter: Point = config.worldCenter;
  const sector = 360 / arr.length + 2;
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];

    let angle = sector * i;
    angle += (GameConfig.ARTCAR_ANGULAR_VELOCITY * new Date().getTime()) % 360;
    angle *= Math.PI / 180;

    const radiusX = getRandomNumber(innerRadius, outerRadius);
    const radiusY = getRandomNumber(innerRadius, outerRadius);
    const x = worldCenter.x + Math.cos(angle) * radiusX;
    const y = worldCenter.y + Math.sin(angle) * radiusY;

    users.push({
      x: x,
      y: y,
      radiusX: radiusX,
      radiusY: radiusY,
      angle: angle,
      data: {
        id: item.link,
        partyName: item.name,
        messengerId: 0,
        pictureUrl: artcars13[i],
        dotColor: i,
        hat: "",
        accessories: "",
        cycle: "",
      },
    });
  }

  return users;
};

export const stubUsersData = () => {
  const config = GameInstance.instance.getConfig();

  const users: Map<string, ReplicatedUser> = new Map();
  const len = GameConfig.QA_BOTS_NUMBER;
  const paddingH = config.worldWidth * 0.1;
  const paddingV = config.worldHeight * 0.1;
  for (let i = 0; i < len; i++) {
    const x = getRandomInt(config.worldWidth - paddingH * 2) + paddingH;
    const y = getRandomInt(config.worldHeight - paddingV * 2) + paddingV;
    const id = uuid();
    users.set(i.toString(), {
      x,
      y,
      data: {
        id: id,
        partyName: id,
        messengerId: getIntByHash(id),
        pictureUrl: `/avatars/default-profile-pic-${getRandomInt(3) + 1}.png`,
        dotColor: Math.floor(Math.random() * 16777215),
        hat: avatarHats[x % avatarHats.length],
        accessories: avatarAccessories[y % avatarAccessories.length],
        cycle: avatarCycles[x % avatarCycles.length],
      },
    } as ReplicatedUser);
  }
  return users;
};
