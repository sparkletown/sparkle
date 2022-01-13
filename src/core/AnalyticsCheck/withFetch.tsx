import React from "react";
import { AnalyticsCheckProps } from "core/AnalyticsCheck/props";

import { determineDisplayName } from "utils/hoc";

import { useSpaceParams } from "hooks/spaces/useSpaceParams";
import { useWorldAndSpaceBySlug } from "hooks/spaces/useWorldAndSpaceBySlug";

export const withFetch = () => (
  Component: React.FC<AnalyticsCheckProps>
): React.FC<AnalyticsCheckProps> => {
  const WithFetch: React.FC = (props) => {
    const slugs = useSpaceParams();
    const { space } = useWorldAndSpaceBySlug(slugs.worldSlug, slugs.spaceSlug);

    return <Component {...props} space={space} />;
  };

  WithFetch.displayName = `withFetch(${determineDisplayName(Component)})`;
  return WithFetch;
};
