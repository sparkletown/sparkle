import React from "react";
import { isEqual } from "lodash";

import { captureAssertError } from "utils/error";

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
    captureAssertError({
      message: "Chat used without world and space",
      where: "SpaceChatHoc",
      args: { worldSlug, spaceSlug, world, space },
    });
    return null;
  }

  return <MemoizedSpaceChat world={world} space={space} />;
};
