import React, { useEffect, useState } from "react";
import { useFirebase } from "react-redux-firebase";

import { Room } from "types/rooms";
import { AnimateMapVenue } from "types/venues";

import { WithId } from "utils/id";
import { WithVenue } from "utils/venue";

import { useWorldUsers } from "hooks/users";
import { useUser } from "hooks/useUser";

import { useRecentLocationsUsers } from "../hooks/useRecentLocationsUsers";
import { useRelatedPartymapRooms } from "../hooks/useRelatedPartymapRooms";

import { CloudDataProvider } from "./DataProvider/CloudDataProvider";

export interface CloudDataProviderWrapperProps {
  venue: WithId<AnimateMapVenue>;
  newDataProviderCreate: (dataProvider: CloudDataProvider) => void;
}

export type RoomWithFullData<T> = T & {
  id: number;
  isLive?: boolean;
  countUsers?: number;
};

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
  console.log("recentLocationUsersResult");
  const roomWithFullData:
    | RoomWithFullData<WithVenue<Room> | Room>[]
    | undefined = rooms?.map((room, index) => {
    if ("venue" in room) {
      console.log("venue with room");
      const res = recentLocationUsersResult.find(
        (item) => item.name === room.venue.name
      );
      return {
        ...room,
        ...{
          countUsers: res ? res.users.length : 0,
          isLive: !!(room.title.length % 2), //todo: remove random flag
          id: index,
        },
      };
    } else
      return {
        ...room,
        ...{ id: index, isLive: !!(room.title.length % 2), countUsers: 0 },
      };
  });

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
