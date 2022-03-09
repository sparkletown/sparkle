import React from "react";
import { useAsync } from "react-use";

import { ALWAYS_EMPTY_ARRAY } from "settings";

import { getUserRef } from "api/profile";

import { SpaceWithId } from "types/id";
import { User } from "types/User";

import { withId } from "utils/id";

import { useShowHide } from "hooks/useShowHide";

import { VenueOwnersModal } from "pages/Admin/VenueOwnersModal";

import { RunTabUserInfo } from "components/organisms/AdminVenueView/components/RunTabUserInfo";

import { ButtonNG } from "components/atoms/ButtonNG";

interface RunTabSidebarProps {
  space: SpaceWithId;
}

export const RunTabUsers: React.FC<RunTabSidebarProps> = ({ space }) => {
  const {
    isShown: isShownInviteAdminModal,
    show: showInviteAdminModal,
    hide: hideInviteAdminModal,
  } = useShowHide();

  const owners = space.owners ?? ALWAYS_EMPTY_ARRAY;

  const { value: admins = ALWAYS_EMPTY_ARRAY } = useAsync(
    async () =>
      Promise.all(owners.map((owner) => getUserRef(owner).get())).then((docs) =>
        docs.map((doc) => withId(doc.data() as User, doc.id))
      ),
    [owners]
  );

  return (
    <div className="RunTabUsers">
      <div className="RunTabUsers__row RunTabUsers__manage">
        <span className="RunTabUsers__info">
          {admins.length} admin{admins.length !== 1 && "s"} online
        </span>
        <ButtonNG onClick={showInviteAdminModal}>Invite admin</ButtonNG>
      </div>
      <VenueOwnersModal
        visible={isShownInviteAdminModal}
        onHide={hideInviteAdminModal}
        venue={space}
      />
      {admins.map((user) => (
        <RunTabUserInfo key={user.id} user={user} />
      ))}
    </div>
  );
};
