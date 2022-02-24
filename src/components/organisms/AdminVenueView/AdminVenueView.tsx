import React, { useCallback, useMemo } from "react";
import { useParams } from "react-router";
import { Link, useHistory } from "react-router-dom";
import { faClock, faPlayCircle } from "@fortawesome/free-regular-svg-icons";
import { faArrowLeft, faBorderNone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

import { ADMIN_IA_WORLD_PARAM_URL, SPACE_TAXON } from "settings";

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

import { AdminRestricted } from "components/atoms/AdminRestricted";
import { ButtonNG } from "components/atoms/ButtonNG";
import { NotFound } from "components/atoms/NotFound";
import { AdminTitle } from "components/molecules/AdminTitle";
import { AdminTitleBar } from "components/molecules/AdminTitleBar";
import { SpaceTimingPanel } from "components/organisms/AdminVenueView/components/SpaceTimingPanel";

import { WithNavigationBar } from "../WithNavigationBar";

import { RunTabView } from "./components/RunTabView";
import { Spaces } from "./components/Spaces";

import "./AdminVenueView.scss";

export enum AdminVenueTab {
  spaces = "spaces",
  timing = "timing",
  run = "run",
}

interface AdminVenueViewRouteParams {
  worldSlug?: WorldSlug;
  spaceSlug?: SpaceSlug;
  selectedTab?: AdminVenueTab;
}

const adminVenueTabLabelMap: Readonly<Record<AdminVenueTab, String>> = {
  [AdminVenueTab.spaces]: "Spaces",
  [AdminVenueTab.timing]: "Timing",
  [AdminVenueTab.run]: "Run",
};

const tabIcons = {
  [AdminVenueTab.spaces]: faBorderNone,
  [AdminVenueTab.timing]: faClock,
  [AdminVenueTab.run]: faPlayCircle,
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

  const renderAdminVenueTabs = useMemo(() => {
    return Object.entries(adminVenueTabLabelMap).map(([key, label]) => (
      <Link
        key={key}
        to={adminNGVenueUrl(worldSlug, spaceSlug, key)}
        className={classNames({
          AdminVenueView__tab: true,
          "AdminVenueView__tab--selected": selectedTab === key,
        })}
      >
        <FontAwesomeIcon
          className="AdminVenueView__tabIcon"
          icon={tabIcons[key as AdminVenueTab]}
        />
        {label}
      </Link>
    ));
  }, [selectedTab, spaceSlug, worldSlug]);

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

  return (
    <WithNavigationBar
      withSchedule
      variant="internal-scroll"
      title={navBarTitle}
    >
      <AdminRestricted>
        <div className="AdminVenueView">
          <AdminTitleBar variant="grid-with-tools">
            <ButtonNG onClick={navigateToHome} iconName={faArrowLeft}>
              Back to Dashboard
            </ButtonNG>
            <AdminTitle>Edit {space.name}</AdminTitle>
            <div>
              <ButtonNG variant="danger" onClick={showDeleteModal}>
                Delete {SPACE_TAXON.lower}
              </ButtonNG>
              <ButtonNG
                isLink
                newTab
                linkTo={
                  spaceSlug
                    ? generateAttendeeInsideUrl({ worldSlug, spaceSlug })
                    : undefined
                }
                variant="primary"
              >
                Visit {SPACE_TAXON.capital}
              </ButtonNG>
            </div>
          </AdminTitleBar>
          <div className="AdminVenueView__tab-bar">
            <div className="AdminVenueView__options">
              {renderAdminVenueTabs}
            </div>
          </div>

          {selectedTab === AdminVenueTab.spaces && <Spaces venue={space} />}
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
    </WithNavigationBar>
  );
};
