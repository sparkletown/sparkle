import React, { useCallback, useMemo } from "react";
import { useParams } from "react-router";
import { Link, useHistory } from "react-router-dom";
import { faClock, faPlayCircle } from "@fortawesome/free-regular-svg-icons";
import { faArrowLeft, faBorderNone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

import { SPACE_TAXON } from "settings";

import { SpaceSlug } from "types/venues";
import { WorldSlug } from "types/world";

import {
  adminNGVenueUrl,
  adminWorldSpacesUrl,
  generateAttendeeInsideSpaceUrl,
} from "utils/url";

import { useWorldAndSpaceBySlug } from "hooks/spaces/useWorldAndSpaceBySlug";
import { useShowHide } from "hooks/useShowHide";

import VenueDeleteModal from "pages/Admin/Venue/VenueDeleteModal";

import { SpaceTimingPanel } from "components/organisms/AdminVenueView/components/SpaceTimingPanel";

import { AdminTitle } from "components/molecules/AdminTitle";
import { AdminTitleBar } from "components/molecules/AdminTitleBar";
import { LoadingPage } from "components/molecules/LoadingPage";

import { AdminRestricted } from "components/atoms/AdminRestricted";
import { ButtonNG } from "components/atoms/ButtonNG";
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

export const AdminVenueView: React.FC = () => {
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

  const { space, spaceId, isLoaded } = useWorldAndSpaceBySlug(
    worldSlug,
    spaceSlug
  );

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
    () => history.push(adminWorldSpacesUrl(worldSlug)),
    [history, worldSlug]
  );

  if (!isLoaded) {
    return <LoadingPage />;
  }

  if (!space) {
    return (
      <WithNavigationBar withSchedule withHiddenLoginButton>
        <AdminRestricted>
          <NotFound />
        </AdminRestricted>
      </WithNavigationBar>
    );
  }

  return (
    <WithNavigationBar withSchedule variant="internal-scroll">
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
                    ? generateAttendeeInsideSpaceUrl({ worldSlug, spaceSlug })
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
            <SpaceTimingPanel venue={space} />
          )}
          {selectedTab === AdminVenueTab.run && <RunTabView venue={space} />}
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
