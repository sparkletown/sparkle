import React from "react";
import { useAsync } from "react-use";

import { ALWAYS_EMPTY_ARRAY, STRING_PLUS } from "settings";

import { getSpaceEditors, getSpaceOwners } from "api/admin";

import { useWorldAndSpaceByParams } from "hooks/spaces/useWorldAndSpaceByParams";
import { useShowHide } from "hooks/useShowHide";

import { VenueOwnersModal } from "pages/Admin/VenueOwnersModal";

import { RunTabUserInfo } from "components/organisms/AdminVenueView/components/RunTabUserInfo";

import "./SpaceUsersManager.scss";

export const SpaceUsersManager: React.FC = () => {
  const { space, world } = useWorldAndSpaceByParams();
  const {
    isShown: isShownInviteAdminModal,
    show: showInviteAdminModal,
    hide: hideInviteAdminModal,
  } = useShowHide();

  const spaceEditors = space?.owners ?? ALWAYS_EMPTY_ARRAY;
  const worldOwners = world?.owners ?? ALWAYS_EMPTY_ARRAY;

  const { value: editorArray = ALWAYS_EMPTY_ARRAY } = useAsync(
    () => getSpaceEditors(spaceEditors),
    [spaceEditors]
  );

  const { value: ownerArray = ALWAYS_EMPTY_ARRAY } = useAsync(
    () => getSpaceOwners(worldOwners),
    [worldOwners]
  );

  if (!space) {
    return null;
  }

  return (
    <div className="SpaceUsersManager">
      <span>Owners</span>
      {ownerArray.map((user) => (
        <RunTabUserInfo key={user.id} user={user} />
      ))}
      <div className="SpaceUsersManager__row SpaceUsersManager__manage">
        <span>Editors</span>
        <span
          className="SpaceUsersManager__invite"
          onClick={showInviteAdminModal}
        >
          {STRING_PLUS} Add editor
        </span>
      </div>
      <VenueOwnersModal
        visible={isShownInviteAdminModal}
        onHide={hideInviteAdminModal}
        venue={space}
      />
      {editorArray.map((user) => (
        <RunTabUserInfo key={user.id} user={user} />
      ))}
    </div>
  );
};
