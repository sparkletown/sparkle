import React from "react";
import { isEqual } from "lodash";

import { captureError, SparkleAssertError } from "utils/error";

import { useWorldAndSpaceByParams } from "hooks/spaces/useWorldAndSpaceByParams";

import { SpaceChat } from "./SpaceChat";

const MemoizedSpaceChat = React.memo(SpaceChat, isEqual);

export const SpaceChatHoc: React.FC = () => {
  const {
    worldSlug,
    spaceSlug,
    world,
    space,
    isLoading,
  } = useWorldAndSpaceByParams();

  if (isLoading) {
    // TODO: Display loading indicator
    return null;
  }

  if (!world || !space) {
    captureError(
      new SparkleAssertError({
        message: "Chat used without world and space",
        where: "SpaceChatHoc",
        args: { worldSlug, spaceSlug, world, space },
      })
    );
    return null;
  }

  return <MemoizedSpaceChat world={world} space={space} />;
};
