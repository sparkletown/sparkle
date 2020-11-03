import React from "react";

// Components
import DetailsForm from "./Form";
import DetailsPreview from "./Preview";

// Typings
import { DetailsProps } from "./Details.types";

// Styles
import "../Venue/Venue.scss";
import * as S from "./Details.styles";

const Details: React.FC<DetailsProps> = ({
  previous,
  venueId,
  state,
  dispatch,
}) => (
  <S.DetailsContainer>
    <S.DetailsFormWrapper>
      <DetailsForm
        previous={previous}
        state={state}
        dispatch={dispatch}
        venueId={venueId || ""}
      />
    </S.DetailsFormWrapper>

    <S.PreviewWrapper>
      <DetailsPreview
        bannerURL={state?.bannerURL}
        logoURL={state?.squareLogoURL}
        name={state?.formValues?.name}
        subtitle={state?.formValues?.subtitle}
        description={state?.formValues?.description}
      />
    </S.PreviewWrapper>
  </S.DetailsContainer>
)

export default Details;
