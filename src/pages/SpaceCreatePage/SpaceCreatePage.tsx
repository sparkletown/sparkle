import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import { SPACE_TAXON } from "settings";

import { adminWorldSpacesUrl } from "utils/url";

import { useSpaceParams } from "hooks/spaces/useSpaceParams";
import { useWorldBySlug } from "hooks/worlds/useWorldBySlug";

import { AdminPanel } from "components/organisms/AdminVenueView/components/AdminPanel";
import { AdminShowcase } from "components/organisms/AdminVenueView/components/AdminShowcase";
import { AdminSidebar } from "components/organisms/AdminVenueView/components/AdminSidebar";
import { PrettyLink } from "components/organisms/AdminVenueView/components/PrettyLink";
import { SpaceCreateForm } from "components/organisms/SpaceCreateForm";
import WithNavigationBar from "components/organisms/WithNavigationBar";

import { AdminTitle } from "components/molecules/AdminTitle";
import { AdminTitleBar } from "components/molecules/AdminTitleBar";
import { Loading } from "components/molecules/Loading";

import { AdminRestricted } from "components/atoms/AdminRestricted";
import { ButtonNG } from "components/atoms/ButtonNG";

import "./SpaceCreatePage.scss";

export const SpaceCreatePage: React.FC = () => {
  const history = useHistory();
  const { worldSlug } = useSpaceParams();
  const { isLoaded: isWorldLoaded, worldId } = useWorldBySlug(worldSlug);

  const homeUrl = adminWorldSpacesUrl(worldSlug);
  const navigateToHome = useCallback(() => history.push(homeUrl), [
    history,
    homeUrl,
  ]);

  return (
    <div className="SpaceCreatePage">
      <WithNavigationBar hasBackButton withSchedule>
        <AdminRestricted>
          <AdminTitleBar variant="two-rows">
            <ButtonNG
              variant="secondary"
              isLink
              linkTo={homeUrl}
              iconName={faArrowLeft}
            >
              Back to dashboard
            </ButtonNG>
            <AdminTitle>Create {SPACE_TAXON.lower}</AdminTitle>
          </AdminTitleBar>
          <AdminPanel variant="unbound">
            <AdminSidebar variant="light">
              {isWorldLoaded ? (
                <>
                  <SpaceCreateForm worldId={worldId} onDone={navigateToHome} />
                  <PrettyLink className="SpaceCreatePage__go-back" to={homeUrl}>
                    Cancel &amp; go back
                  </PrettyLink>
                </>
              ) : (
                <Loading />
              )}
            </AdminSidebar>
            <AdminShowcase>
              <div>empty for now, images to show later</div>
            </AdminShowcase>
          </AdminPanel>
        </AdminRestricted>
      </WithNavigationBar>
    </div>
  );
};
