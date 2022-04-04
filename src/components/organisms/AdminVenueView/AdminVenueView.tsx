import React, { useCallback, useMemo } from "react";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";
import { AdminRestrictedLoading } from "components/admin/AdminRestrictedLoading";
import { AdminRestrictedMessage } from "components/admin/AdminRestrictedMessage";
import { Header } from "components/admin/Header";
import { HeaderButton } from "components/admin/HeaderButton";
import { SpaceDeleteModal } from "components/admin/SpaceDeleteModal";
import { SpaceSchedule } from "components/admin/SpaceSchedule";
import { TabBar } from "components/admin/TabBar";
import { AdminLayout } from "components/layouts/AdminLayout";
import { NotFound } from "components/shared/NotFound";
import { WithPermission } from "components/shared/WithPermission";

import { ADMIN_IA_WORLD_PARAM_URL } from "settings";

import {
  SpaceId,
  SpaceSlug,
  SpaceWithId,
  WorldSlug,
  WorldWithId,
} from "types/id";

import {
  adminNGVenueUrl,
  externalUrlAdditionalProps,
  generateAttendeeInsideUrl,
  generateUrl,
} from "utils/url";

import { useShowHide } from "hooks/useShowHide";

import { RunTabView } from "./components/RunTabView";
import { Spaces } from "./components/Spaces";

import "./AdminVenueView.scss";

export enum AdminVenueTab {
  spaces = "spaces",
  schedule = "schedule",
  run = "run",
}

interface AdminVenueViewRouteParams {
  worldSlug?: WorldSlug;
  spaceSlug?: SpaceSlug;
  selectedTab?: AdminVenueTab;
}

const adminVenueTabLabelMap: Readonly<Record<AdminVenueTab, string>> = {
  [AdminVenueTab.spaces]: "Spaces",
  [AdminVenueTab.schedule]: "Schedule",
  [AdminVenueTab.run]: "Run",
};

type AdminVenueViewProps = {
  space: SpaceWithId;
  spaceId: SpaceId;
  world: WorldWithId;
};

export const AdminVenueView: React.FC<AdminVenueViewProps> = ({
  spaceId,
  space,
  world,
}) => {
  const history = useHistory();
  const {
    worldSlug,
    spaceSlug,
    selectedTab = AdminVenueTab.spaces,
  } = useParams<AdminVenueViewRouteParams>();
  const {
    isShown: isDeleteModalShown,
    show: showDeleteModal,
    hide: closeDeleteModal,
  } = useShowHide();

  const tabs = useMemo(() => {
    return Object.fromEntries(
      Object.entries(adminVenueTabLabelMap).map(([key, label]) => {
        const url = adminNGVenueUrl(worldSlug, spaceSlug, key);
        return [key, { url, label }];
      })
    );
  }, [spaceSlug, worldSlug]);

  const navigateToHome = useCallback(
    () =>
      history.push(
        generateUrl({
          route: ADMIN_IA_WORLD_PARAM_URL,
          required: ["worldSlug"],
          params: { worldSlug },
        })
      ),
    [history, worldSlug]
  );

  const crumbtrail = useMemo(
    () => [
      {
        name: "Spaces",
        href: generateUrl({
          route: ADMIN_IA_WORLD_PARAM_URL,
          required: ["worldSlug"],
          params: { worldSlug },
        }),
      },
    ],
    [worldSlug]
  );

  const subtitleItems = useMemo(() => [{ text: space.template }], [
    space.template,
  ]);

  if (!space) {
    return (
      <WithPermission
        check="space"
        loading={<AdminRestrictedLoading />}
        fallback={<AdminRestrictedMessage />}
      >
        <NotFound />
      </WithPermission>
    );
  }
  const visitSpaceUrl = spaceSlug
    ? generateAttendeeInsideUrl({ worldSlug, spaceSlug })
    : undefined;

  // @debt use a single structure of type Record<VenueTemplate,TemplateInfo> to
  // compile info like the subtitle which should be a friendly taxon of the
  // template e.g. "Map" not "partymap"

  return (
    <AdminLayout>
      <WithPermission
        check="space"
        loading={<AdminRestrictedLoading />}
        fallback={<AdminRestrictedMessage />}
      >
        <div className="AdminVenueView">
          <Header
            title={space.name}
            subtitleItems={subtitleItems}
            crumbtrail={crumbtrail}
          >
            <HeaderButton
              name="Delete space"
              variant="danger"
              onClick={showDeleteModal}
            />
            <HeaderButton
              to={visitSpaceUrl}
              name="Visit space"
              variant="primary"
              {...externalUrlAdditionalProps}
            />
          </Header>

          <TabBar tabs={tabs} selectedTab={selectedTab} />

          {selectedTab === AdminVenueTab.spaces && (
            <Spaces space={space} world={world} />
          )}
          {selectedTab === AdminVenueTab.schedule && (
            <SpaceSchedule
              globalStartTime={world.startTimeUnix}
              globalEndTime={world.endTimeUnix}
              space={space}
            />
          )}
          {selectedTab === AdminVenueTab.run && <RunTabView space={space} />}

          <SpaceDeleteModal
            spaceId={spaceId}
            spaceName={space?.name}
            show={isDeleteModalShown}
            onDelete={navigateToHome}
            onHide={closeDeleteModal}
            onCancel={closeDeleteModal}
          />
        </div>
      </WithPermission>
    </AdminLayout>
  );
};
