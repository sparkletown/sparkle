import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { AdminRestrictedLoading } from "components/admin/AdminRestrictedLoading";
import { AdminRestrictedMessage } from "components/admin/AdminRestrictedMessage";
import { Button } from "components/admin/Button";
import { Header } from "components/admin/Header";
import { Input } from "components/admin/Input";
import { InviteAdminModal } from "components/admin/InviteAdminModal";
import { WorldUserCard } from "components/admin/WorldUserCard";
import { AdminLayout } from "components/layouts/AdminLayout";
import { WithPermission } from "components/shared/WithPermission";
import { includes, sortBy } from "lodash";

import { UserId, WorldSlug } from "types/id";

import { useWorldSpaces } from "hooks/spaces/useWorldSpaces";
import { useProfileByIds } from "hooks/user/useProfileByIds";
import { useUserId } from "hooks/user/useUserId";
import { useShowHide } from "hooks/useShowHide";
import { useLiveWorldBySlug } from "hooks/worlds/useLiveWorldBySlug";
import { useWorldParams } from "hooks/worlds/useWorldParams";

import { LoadingPage } from "components/molecules/LoadingPage";

import * as TW from "./WorldUsers.tailwind";

export const WorldUsers: React.FC = () => {
  const { worldSlug } = useWorldParams();

  const { world, isWorldLoading } = useLiveWorldBySlug(worldSlug as WorldSlug);

  const { userId } = useUserId();

  const {
    isShown: isShownInviteAdminModal,
    show: showInviteAdminModal,
    hide: hideInviteAdminModal,
  } = useShowHide();

  const defaultValues = useMemo(
    () => ({
      nameSearchQuery: "",
      spaceSearchQuery: "",
    }),
    []
  );

  const { register, watch } = useForm({
    reValidateMode: "onChange",
    defaultValues,
  });

  const { nameSearchQuery, spaceSearchQuery } = watch();

  const owners = world?.owners;

  const { spaces: worldSpaces } = useWorldSpaces({ worldId: world?.id });

  const users = useProfileByIds({ userIds: owners as UserId[] });

  const filteredUsers = users?.filter((user) =>
    user.partyName?.toLowerCase().includes(nameSearchQuery.toLowerCase())
  );

  // Alphabetical sort by field (partyName), first uppercase then lowercase.
  const sortedUsers = sortBy(filteredUsers, ["partyName"]);

  const userSpaces = sortedUsers?.map((user) => {
    return {
      user: user,
      spaces: worldSpaces.filter((space) =>
        space.owners?.includes(user.id as string)
      ),
    };
  });

  const filteredUserSpaces = userSpaces?.filter((userSpace) => {
    const spacesNames = userSpace.spaces
      .map((space) => space.name.toLowerCase())
      .join();

    return includes(spacesNames, spaceSearchQuery.toLowerCase());
  });

  if (isWorldLoading) {
    return <LoadingPage />;
  }

  return (
    <AdminLayout>
      <WithPermission
        check="world"
        loading={<AdminRestrictedLoading />}
        fallback={<AdminRestrictedMessage />}
      >
        <Header title="Users" />
        <div className={TW.content}>
          <div className={TW.panelHeader}>
            <div className={TW.panelHeaderTitle}>Admins</div>
            <Button onClick={showInviteAdminModal}>Invite admin</Button>
          </div>
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <div className="min-w-full divide-y divide-gray-200">
              <div className="bg-gray-50 flex flex-row px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider items-center">
                <div className="w-full flex flex-row gap-x-4 items-center">
                  <div className="flex flex-row gap-x-4 items-center w-full">
                    <div>Name</div>
                    <Input
                      placeholder="Filter by name"
                      name="nameSearchQuery"
                      register={register}
                    />
                  </div>
                  <div className="w-full">Role</div>
                  <div className="flex flex-row gap-x-4 items-center w-full">
                    <div>Spaces</div>
                    <Input
                      placeholder="Filter by space"
                      name="spaceSearchQuery"
                      register={register}
                    />
                  </div>
                  <div className="w-full" />
                </div>
              </div>

              <div className="bg-white divide-y divide-gray-200">
                {filteredUserSpaces?.map((userSpace) => (
                  <WorldUserCard
                    key={userSpace.user.id}
                    userId={userId}
                    user={userSpace.user}
                    ownedSpaces={userSpace.spaces}
                    worldSpaces={worldSpaces}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        {isShownInviteAdminModal && (
          <InviteAdminModal
            show={isShownInviteAdminModal}
            onHide={hideInviteAdminModal}
          />
        )}
      </WithPermission>
    </AdminLayout>
  );
};
