import React from "react";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import { SPACE_TAXON, STRING_AMPERSAND } from "settings";

import { adminWorldSpacesUrl } from "utils/url";

import { useSpaceParams } from "hooks/spaces/useSpaceParams";
import { useWorldBySlug } from "hooks/worlds/useWorldBySlug";

import { AdminPanel } from "components/organisms/AdminVenueView/components/AdminPanel";
import { AdminShowcase } from "components/organisms/AdminVenueView/components/AdminShowcase";
import { AdminSidebar } from "components/organisms/AdminVenueView/components/AdminSidebar";
import { PrettyLink } from "components/organisms/AdminVenueView/components/PrettyLink";
import { PortalShowcase } from "components/organisms/PortalShowcase";
import { SpaceCreateForm } from "components/organisms/SpaceCreateForm";
import WithNavigationBar from "components/organisms/WithNavigationBar";

import { AdminTitle } from "components/molecules/AdminTitle";
import { AdminTitleBar } from "components/molecules/AdminTitleBar";
import { Loading } from "components/molecules/Loading";

import { AdminRestricted } from "components/atoms/AdminRestricted";
import { ButtonNG } from "components/atoms/ButtonNG";

import "./SpaceCreatePage.scss";

export const SpaceCreatePage: React.FC = () => {
  const { worldSlug } = useSpaceParams();
  const { isLoaded: isWorldLoaded, worldId } = useWorldBySlug(worldSlug);

  const homeUrl = adminWorldSpacesUrl(worldSlug);

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
                  <SpaceCreateForm worldId={worldId} />
                  <PrettyLink className="SpaceCreatePage__go-back" to={homeUrl}>
                    Cancel {STRING_AMPERSAND} go back
                  </PrettyLink>
                </>
              ) : (
                <Loading />
              )}
            </AdminSidebar>
            <AdminShowcase>
              <PortalShowcase />
            </AdminShowcase>
          </AdminPanel>
        </AdminRestricted>
      </WithNavigationBar>
    </div>
  );
};
