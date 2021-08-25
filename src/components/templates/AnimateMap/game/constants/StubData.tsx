import { uuid } from "uuidv4";

import { ReplicatedUser } from "store/reducers/AnimateMap";

import { getRandomInt } from "utils/getRandomInt";

import { getIntByHash } from "../../bridges/DataProvider/Contructor/PlayerIO/utils/getIntByHash";
import { GameConfig } from "../../configs/GameConfig";
import { GameInstance } from "../GameInstance";

import { avatarAccessories, avatarCycles, avatarHats } from "./AssetConstants";

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
        messengerId: getIntByHash(id),
        videoUrlString: "",
        avatarUrlString: `/avatars/default-profile-pic-${
          getRandomInt(3) + 1
        }.png`,
        dotColor: Math.floor(Math.random() * 16777215),
        hat: avatarHats[x % avatarHats.length],
        accessories: avatarAccessories[y % avatarAccessories.length],
        cycle: avatarCycles[x % avatarCycles.length],
      },
    });
  }
  return users;
};
