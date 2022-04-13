import { v4 as uuid } from "uuid";

import { DEFAULT_AVATAR_LIST } from "settings";

import { getRandomInt } from "utils/getRandomInt";
import { determineAvatar } from "utils/image";

import { GameConfig } from "components/templates/GameConfig/GameConfig";

import {
  ReplicatedArtcar,
  ReplicatedUser,
} from "../../GameInstanceCommonInterfaces";
import { getIntByHash } from "../../GameServerProvider";
import { Point } from "../../types";
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
      info:
        "Enter... Darth Paul Art Car. Come to the dark side and get your double saber out for a Jedi dance party like no other.",
      color: 0xff6600,
    },
    {
      name: "Hand Some Art Car",
      link: "https://burn.sparklever.se/in/handsome",
      info: "Oh Hand Some Art Car, you're so endearing and gorgeous.",
      color: 0x99ccff,
    },
    {
      name: "Lobo de Playa Art Car",
      link: "https://burn.sparklever.se/in/lobodeplaya",
      info: "Welcome to the Lobo de Playa Art Car. Howl at the Moon with us...",
      color: 0xff3333,
    },
    {
      name: "Send Noods Art Car",
      link: "thttps://burn.sparklever.se/in/sendnoods",
      info: "Slurp up Send Noods Art Car. How hard do you like your noodles?",
      color: 0x9933ff,
    },
    {
      name: "Arachnia Art Car",
      link: "https://burn.sparklever.se/in/arachnia",
      info:
        "ARGHHH IT'S THE to the Arachnia Art Car. Scuttle about the Playa and kick up some dust with us.",
      color: 0x66ff66,
    },
    {
      name: "Silly Lily Art Car",
      link: "https://burn.sparklever.se/in/sillylily",
      info:
        "Bloom with the Silly Lily Art Car and let's go on a journey of self discovery.",
      color: 0xffff33,
    },
    {
      name: "Glam Clam Art Car",
      link: "https://burn.sparklever.se/in/glamclam",
      info:
        "Let the Glam Clam Art Car open it's mollusc mouth up to you so you can enjoy fresh fruit and pearls on playa",
      color: 0xcc33ff,
    },
    {
      name: "Dragon: The Car Art Car",
      link: "https://burn.sparklever.se/in/dragonthecar",
      info:
        "Burninating all the peasants, in their thatched roof cottages!!! THATCHED ROOF COTTAGES! Come in to Dragon: The Car, the Art Car.",
      color: 0xffcc33,
    },
    {
      name: "Tri-Honk Art Car",
      link: "https://burn.sparklever.se/in/trihonk",
      info: "Honk honk honk. Tri-Honk Art Car is ready to cause a nuisance",
      color: 0xff99cc,
    },
    {
      name: "Caranirvana Art Car",
      link: "https://burn.sparklever.se/in/caranirvana",
      info: "Start wearing purple, wearing purple on the Caranirvana Art Car. ",
      color: 0xff33cc,
    },
    {
      name: "Boaty McBoatface Art Car",
      link: "https://burn.sparklever.se/in/interiorcrocodilealligator",
      info:
        "Ahoy Mateys, Boaty McBoatface is here to ship you off on the Art Car of your dreams.",
      color: 0x3399ff,
    },
    {
      name: "Interior Crocodile Alligator Art Car",
      link: "https://burn.sparklever.se/in/lobodeplaya",
      info: "Snap it up, and jump on to Interior Crocodile Alligator Art Car.",
      color: 0x33ffcc,
    },
    {
      name: "Wheely Fish Sticks Art Car",
      link: "https://burn.sparklever.se/in/wheelyfishsticks",
      info:
        "He's wheeling, he's dealing, it's Wheely Fish Sticks Art Car! Excuse the smell and come see what's happening here!",
      color: 0x99ffff,
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
    let angle = sector * i;
    angle += GameConfig.ARTCAR_ANGULAR_VELOCITY * (Date.now() - 1630629578769);

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
      colorIndex: i,
      color: arr[i].color,
      data: {
        id: i * Date.now(),
        isLive: true,
        countUsers: 0,
        title: arr[i].name,
        subtitle: arr[i].info,
        url: arr[i].link,
        about: arr[i].info,
        x_percent: 0.5,
        y_percent: 0.5,
        width_percent: 0.5,
        height_percent: 0.5,
        isEnabled: true,
        image_url: artcars13[i],
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
        pictureUrl: determineAvatar({
          avatars: DEFAULT_AVATAR_LIST,
          index: getRandomInt(DEFAULT_AVATAR_LIST.length - 1),
        }).src,
        dotColor: Math.floor(Math.random() * 16777215),
        hat: avatarHats[x % avatarHats.length],
        accessories: avatarAccessories[y % avatarAccessories.length],
        cycle: avatarCycles[x % avatarCycles.length],
      },
    } as ReplicatedUser);
  }
  return users;
};
