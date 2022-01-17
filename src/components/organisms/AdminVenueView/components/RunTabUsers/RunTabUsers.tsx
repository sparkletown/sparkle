import React from "react";
import { useParams } from "react-router-dom";
import { useAsync } from "react-use";

import { ALWAYS_EMPTY_ARRAY, STRING_PLUS } from "settings";

import { getUserRef } from "api/profile";

import { User } from "types/User";

import { withId } from "utils/id";

import { useWorldAndSpaceBySlug } from "hooks/spaces/useWorldAndSpaceBySlug";
import { useShowHide } from "hooks/useShowHide";

import { VenueOwnersModal } from "pages/Admin/VenueOwnersModal";

import { RunTabUserInfo } from "components/organisms/AdminVenueView/components/RunTabUserInfo";

import { AdminVenueViewRouteParams } from "../../AdminVenueView";

import "./RunTabUsers.scss";

export const RunTabUsers: React.FC = () => {
  const { worldSlug, spaceSlug } = useParams<AdminVenueViewRouteParams>();

  const { space, world } = useWorldAndSpaceBySlug(worldSlug, spaceSlug);
  const {
    isShown: isShownInviteAdminModal,
    show: showInviteAdminModal,
    hide: hideInviteAdminModal,
  } = useShowHide();

  const spaceEditors = space?.owners ?? ALWAYS_EMPTY_ARRAY;
  const worldOwners = world?.owners ?? ALWAYS_EMPTY_ARRAY;

  const { value: editors = ALWAYS_EMPTY_ARRAY } = useAsync(
    async () =>
      Promise.all(
        [...worldOwners, ...spaceEditors].map((admin) =>
          getUserRef(admin).get()
        )
      ).then((docs) => docs.map((doc) => withId(doc.data() as User, doc.id))),
    [spaceEditors, worldOwners]
  );

  const editorArray = editors.slice(worldOwners.length);
  const ownerArray = editors.slice(0, worldOwners.length);

  if (!space) {
    return null;
  }

  return (
    <div className="RunTabUsers">
      <span>Owners</span>
      {ownerArray.map((user) => (
        <RunTabUserInfo key={user.id} user={user} />
      ))}
      <div className="RunTabUsers__row RunTabUsers__manage">
        <span>Editors</span>
        <span className="RunTabUsers__invite" onClick={showInviteAdminModal}>
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
