import React from "react";
import { AnalyticsCheckProps } from "core/AnalyticsCheck/props";

import { determineDisplayName } from "utils/hoc";

import { useSpaceParams } from "hooks/spaces/useSpaceParams";
import { useWorldAndSpaceBySlug } from "hooks/spaces/useWorldAndSpaceBySlug";

export const withFetch =
  () =>
  (Component: React.FC<AnalyticsCheckProps>): React.FC<AnalyticsCheckProps> => {
    console.log(withFetch.name, "wrapping..");

    const WithFetch: React.FC = (props) => {
      const slugs = useSpaceParams();
      const { space } = useWorldAndSpaceBySlug(
        slugs.worldSlug,
        slugs.spaceSlug
      );

      console.log(WithFetch.name, "rendering...", space);
      return <Component {...props} space={space} />;
    };

    WithFetch.displayName = `withFetch(${determineDisplayName(Component)})`;
    return WithFetch;
  };
