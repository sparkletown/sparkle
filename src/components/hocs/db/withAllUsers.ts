import React from "react";

import { ALWAYS_EMPTY_ARRAY, COLLECTION_USERS } from "settings";

import { Users, UserWithId } from "types/id";

import { hoistHocStatics } from "utils/hoc";

import { useLiveCollection } from "hooks/fire/useLiveCollection";

export const withAllUsers = <T extends object = {}>(Component: React.FC<T>) => {
  const WithAllUsers = (props: T) => {
    // @debt reading every user is obviously bad, maybe it's a good fit for a read-once DB function to be used

    const result = useLiveCollection<UserWithId>([COLLECTION_USERS]);
    const users: Users = result.data ?? ALWAYS_EMPTY_ARRAY;
    const isLoadingUsers: boolean = result.isLoading;

    return React.createElement(Component, {
      ...props,
      users,
      isLoadingUsers,
    });
  };

  hoistHocStatics("withAllUsers", WithAllUsers, Component);
  return WithAllUsers;
};
