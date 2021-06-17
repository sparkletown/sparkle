import {
  ReplicatedUser,
  ReplicatedVenue,
} from "../../../../store/reducers/AnimateMap";
import { getRandomInt } from "../../../../utils/getRandomInt";
import { avatars, default_avatars, ROOM_ICON_3 } from "./Resources";

export const stubVenuesData = () => {
  const venues: Map<string, ReplicatedVenue> = new Map();
  for (let i = 0; i < 80; i++) {
    const x = getRandomInt(9920);
    const y = getRandomInt(9920);
    venues.set(i.toString(), {
      x: x,
      y: y,
      data: {
        id: i.toString(),
        videoUrlString: "",
        imageUrlString: ROOM_ICON_3,
      },
    });
  }
  return venues;
};

export const stubUsersData = () => {
  const users: Map<string, ReplicatedUser> = new Map();
  for (let i = 0; i < 300; i++) {
    const x = getRandomInt(9920);
    const y = getRandomInt(9920);
    users.set(i.toString(), {
      x: x,
      y: getRandomInt(9920),
      data: {
        id: i.toString(),
        videoUrlString: avatars[x % 12],
        avatarUrlString: default_avatars[y % 4],
        dotColor: Math.floor(Math.random() * 16777215),
      },
    });
  }
  return users;
};
