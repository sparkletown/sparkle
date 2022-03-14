import React, { useCallback, useMemo } from "react";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";
import { Header } from "components/admin/Header";
import { HeaderButton } from "components/admin/HeaderButton";
import { TabBar } from "components/admin/TabBar";
import { AdminLayout } from "components/layouts/AdminLayout";

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
  generateAttendeeInsideUrl,
  generateUrl,
} from "utils/url";

import { useShowHide } from "hooks/useShowHide";

import VenueDeleteModal from "pages/Admin/Venue/VenueDeleteModal";

import { SpaceTimingPanel } from "components/organisms/AdminVenueView/components/SpaceTimingPanel";

import { AdminRestricted } from "components/atoms/AdminRestricted";
import { NotFound } from "components/atoms/NotFound";

import { WithNavigationBar } from "../WithNavigationBar";

import { RunTabView } from "./components/RunTabView";
import { Spaces } from "./components/Spaces";

import "./AdminVenueView.scss";

export enum AdminVenueTab {
  spaces = "spaces",
  timing = "timing",
  run = "run",
}

export interface AdminVenueViewRouteParams {
  worldSlug?: WorldSlug;
  spaceSlug?: SpaceSlug;
  selectedTab?: AdminVenueTab;
}

const adminVenueTabLabelMap: Readonly<Record<AdminVenueTab, string>> = {
  [AdminVenueTab.spaces]: "Spaces",
  [AdminVenueTab.timing]: "Timing",
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

  const navBarTitle = `${world?.name ?? ""}`;

  if (!space) {
    return (
      <WithNavigationBar withSchedule withHiddenLoginButton title={navBarTitle}>
        <AdminRestricted>
          <NotFound />
        </AdminRestricted>
      </WithNavigationBar>
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
      <AdminRestricted>
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
            />
          </Header>

          <TabBar tabs={tabs} selectedTab={selectedTab} />

          {selectedTab === AdminVenueTab.spaces && (
            <Spaces space={space} world={world} />
          )}
          {selectedTab === AdminVenueTab.timing && (
            <SpaceTimingPanel space={space} />
          )}
          {selectedTab === AdminVenueTab.run && <RunTabView space={space} />}

          <VenueDeleteModal
            venueId={spaceId}
            venueName={space?.name}
            show={isDeleteModalShown}
            onDelete={navigateToHome}
            onHide={closeDeleteModal}
            onCancel={closeDeleteModal}
          />
        </div>
      </AdminRestricted>
    </AdminLayout>
  );
};
