import React from "react";

import { UserId } from "types/id";

import { hoistHocStatics } from "utils/hoc";

import { useProfileById } from "hooks/user/useProfileById";

type Attributes = { userId: UserId };
type Props<T extends Attributes> = T;

export const withProfileById = <T extends Attributes>(
  Component: React.FC<Props<T>>
) => {
  const WithProfileById = (props: Props<T>) => {
    const {
      error: profileError,
      isLoading: isProfileByIdLoading,
      isLoaded: isProfileByIdLoaded,
      profile,
    } = useProfileById(props);

    return React.createElement(Component, {
      ...props,
      profile,
      isProfileByIdLoading,
      isProfileByIdLoaded,
      profileError,
    });
  };

  hoistHocStatics("withProfileById", WithProfileById, Component);
  return WithProfileById;
};
