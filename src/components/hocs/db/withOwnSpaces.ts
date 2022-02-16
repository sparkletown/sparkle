import React from "react";

import { hoistHocStatics } from "utils/hoc";

import { useOwnedVenues, UseOwnedVenuesOptions } from "hooks/useOwnedVenues";

type WithOwnSpacesInProps<T extends UseOwnedVenuesOptions> = T;

export const withOwnSpaces = <T extends UseOwnedVenuesOptions>(
  Component: React.FC<WithOwnSpacesInProps<T>>
) => {
  const WithOwnSpaces = (props: WithOwnSpacesInProps<T>) => {
    const {
      ownedVenues: ownSpaces,
      isLoading: isLoadingOwnSpaces,
    } = useOwnedVenues(props);

    return React.createElement(Component, {
      ...props,
      ownSpaces,
      isLoadingOwnSpaces,
    });
  };

  hoistHocStatics("withOwnSpaces", WithOwnSpaces, Component);
  return WithOwnSpaces;
};
