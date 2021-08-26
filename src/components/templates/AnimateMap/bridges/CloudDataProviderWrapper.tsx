import React, { useEffect, useState } from "react";
import { useFirebase } from "react-redux-firebase";

import { AnimateMapVenue } from "types/venues";

import { WithId } from "utils/id";

import { useWorldUsers } from "hooks/users";
import { useUser } from "hooks/useUser";

import { Room } from "../../../../types/rooms";
import { getRandomInt } from "../../../../utils/getRandomInt";
import { WithVenue } from "../../../../utils/venue";
import { useRecentLocationsUsers } from "../hooks/useRecentLocationsUsers";
import { useRelatedPartymapRooms } from "../hooks/useRelatedPartymapRooms";

import { CloudDataProvider } from "./DataProvider/CloudDataProvider";

export interface CloudDataProviderWrapperProps {
  venue: WithId<AnimateMapVenue>;
  newDataProviderCreate: (dataProvider: CloudDataProvider) => void;
}

export type RoomWithFullData<T> =
  | T
  | (T & { countUsers: number; isLive: boolean });

export const CloudDataProviderWrapper: React.FC<CloudDataProviderWrapperProps> = ({
  venue,
  newDataProviderCreate,
}) => {
  const [dataProvider, setDataProvider] = useState<CloudDataProvider | null>(
    null
  );
  const firebase = useFirebase();
  const user = useUser();
  const worldUsers = useWorldUsers();

  const rooms = useRelatedPartymapRooms({ venue });
  const venues = rooms
    ?.map((room) => {
      return "venue" in room ? room.venue.name : null;
    })
    .filter((room) => room);
  const recentLocationUsersResult = useRecentLocationsUsers(venues).filter(
    (item) => item.isSuccess && item.users.length
  );

  console.log(recentLocationUsersResult);
  const roomWithFullData:
    | RoomWithFullData<WithVenue<Room> | Room>[]
    | undefined = rooms?.map((room) => {
    if ("venue" in room) {
      // eslint-disable-next-line no-debugger
      // debugger;
      const res = recentLocationUsersResult.find(
        (i) => i.name === room.venue.name
      );
      return {
        ...room,
        ...{
          countUsers: res ? res.users.length : 0,
          isLive: getRandomInt(2),
        },
      };
    } else return room;
  });

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  console.log(
    "-------useRecentLocationsUsers",
    roomWithFullData?.filter((i) => i.countUsers)
  );

  useEffect(() => {
    if (dataProvider) dataProvider.updateRooms(roomWithFullData);
  }, [roomWithFullData, dataProvider]);

  useEffect(() => {
    if (dataProvider) dataProvider.updateUsersAsync(worldUsers);
  }, [worldUsers, dataProvider]);

  useEffect(
    () => {
      if (typeof user.userId === "string" && !dataProvider && firebase) {
        const dataProvider = new CloudDataProvider(
          user.userId,
          user.profile?.pictureUrl,
          firebase,
          venue.playerioGameId ?? "sparkleburn-k1eqbxs6vusie0yujooma"
        );
        dataProvider.updateRooms(roomWithFullData);
        dataProvider.updateUsers(worldUsers);
        setDataProvider(dataProvider);
        newDataProviderCreate(dataProvider);
      }
    },
    // note: we really doesn't need rerender this for others dependencies
    //eslint-disable-next-line react-hooks/exhaustive-deps
    [user, dataProvider, firebase]
  );

  return null;
};
