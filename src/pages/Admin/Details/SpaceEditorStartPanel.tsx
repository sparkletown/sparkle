import React from "react";

import { useCheckImage } from "hooks/useCheckImage";

import { AdminPanel } from "components/organisms/AdminVenueView/components/AdminPanel";
import { AdminShowcase } from "components/organisms/AdminVenueView/components/AdminShowcase";
import { AdminSidebar } from "components/organisms/AdminVenueView/components/AdminSidebar";

import { DetailsProps } from "./Details.types";
import DetailsForm from "./Form";
import DetailsPreview from "./Preview";

import "./SpaceEditorStartPanel.scss";

export const SpaceEditorStartPanel: React.FC<DetailsProps> = ({
  venue,
  state,
  dispatch,
}) => {
  const { isValid: hasBannerImage } = useCheckImage(state.bannerImageUrl);
  const { isValid: hasLogoImage } = useCheckImage(state.logoImageUrl);

  return (
    <AdminPanel className="SpaceEditorStartPanel">
      <AdminSidebar>
        <DetailsForm dispatch={dispatch} venue={venue} />
      </AdminSidebar>

      <AdminShowcase>
        <DetailsPreview
          name={state.name ? state.name : venue?.name}
          subtitle={
            state.subtitle
              ? state.subtitle
              : venue?.config?.landingPageConfig.subtitle
          }
          description={
            state.description
              ? state.description
              : venue?.config?.landingPageConfig.description
          }
          bannerImageUrl={
            hasBannerImage
              ? state.bannerImageUrl
              : venue?.config?.landingPageConfig.coverImageUrl
          }
          logoImageUrl={hasLogoImage ? state.logoImageUrl : venue?.host?.icon}
        />
      </AdminShowcase>
    </AdminPanel>
  );
};
