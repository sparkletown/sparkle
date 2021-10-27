import React from "react";

import * as S from "./Details.styles";
// Typings
import { DetailsProps } from "./Details.types";
// Components
import DetailsForm from "./Form";
import DetailsPreview from "./Preview";

// Styles
import "../Venue/Venue.scss";

const Details: React.FC<DetailsProps> = ({ venue }) => (
  <S.DetailsContainer>
    <S.DetailsFormWrapper>
      <DetailsForm venue={venue} />
    </S.DetailsFormWrapper>

    <S.PreviewWrapper>
      <DetailsPreview
        name={venue?.name}
        subtitle={venue?.config?.landingPageConfig.subtitle}
        description={venue?.config?.landingPageConfig.description}
        bannerImageUrl={venue?.config?.landingPageConfig.coverImageUrl}
        logoImageUrl={venue?.host?.icon}
      />
    </S.PreviewWrapper>
  </S.DetailsContainer>
);

export default Details;
