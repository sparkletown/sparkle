import React from "react";

import { Users } from "types/id";

import { hoistHocStatics } from "utils/hoc";

export const withAllUsers = <T extends object = {}>(Component: React.FC<T>) => {
  const WithAllUsers = (props: T) => {
    // @debt reading every user is obviously bad, maybe it's a good fit for a read-once DB function to be used

    // const result = useRefiCollection<UserWithId>([COLLECTION_USERS]);
    // const users: Users = result.data;
    // const isLoadingUsers: boolean = result.isLoading;
    
    const users: Users = [];
    const isLoadingUsers = false;

    return React.createElement(Component, {
      ...props,
      users,
      isLoadingUsers,
    });
  };

  hoistHocStatics("withAllUsers", WithAllUsers, Component);
  return WithAllUsers;
};
