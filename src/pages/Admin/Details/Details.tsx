import React from "react";

import { useCheckImage } from "hooks/useCheckImage";

import * as S from "./Details.styles";
// Typings
import { DetailsProps } from "./Details.types";
// Components
import DetailsForm from "./Form";
import DetailsPreview from "./Preview";

// Styles
import "../Venue/Venue.scss";

const Details: React.FC<DetailsProps> = ({ venue, state, dispatch }) => {
  const { isValid: hasBannerImage } = useCheckImage(state.bannerImageUrl);
  const { isValid: hasLogoImage } = useCheckImage(state.logoImageUrl);

  return (
    <S.DetailsContainer>
      <S.DetailsFormWrapper>
        <DetailsForm dispatch={dispatch} venue={venue} />
      </S.DetailsFormWrapper>

      <S.PreviewWrapper>
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
      </S.PreviewWrapper>
    </S.DetailsContainer>
  );
};

export default Details;
