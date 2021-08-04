import { uuid } from "uuidv4";
import { avatarAccessories, avatarCycles, avatarHats } from "./AssetConstants";
import { getRandomInt } from "utils/getRandomInt";
import { GameInstance } from "../GameInstance";
import {
  AnimateMapEntityType,
  ReplicatedUser,
} from "store/reducers/AnimateMap";
import { GameConfig } from "../../configs/GameConfig";

export const stubUsersData = () => {
  const config = GameInstance.instance.getConfig();

  const users: Map<string, ReplicatedUser> = new Map();
  const len = GameConfig.QA_BOTS_NUMBER;
  const paddingH = config.worldWidth * 0.1;
  const paddingV = config.worldHeight * 0.1;
  for (let i = 0; i < len; i++) {
    const x = getRandomInt(config.worldWidth - paddingH * 2) + paddingH;
    const y = getRandomInt(config.worldHeight - paddingV * 2) + paddingV;
    users.set(i.toString(), {
      id: uuid(),
      type: AnimateMapEntityType.user,
      x,
      y,
      data: {
        videoUrlString: "",
        avatarUrlString: `/avatars/avatar-0${getRandomInt(8) + 1}.png`,
        dotColor: Math.floor(Math.random() * 16777215),
        hat: avatarHats[x % avatarHats.length],
        accessories: avatarAccessories[y % avatarAccessories.length],
        cycle: avatarCycles[x % avatarCycles.length],
      },
    });
  }
  return users;
};
