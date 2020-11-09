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
  editData,
  dispatch,
}) => (
  <S.DetailsContainer>
    <S.DetailsFormWrapper>
      <DetailsForm
        previous={previous}
        editData={editData}
        dispatch={dispatch}
        venueId={venueId || ""}
      />
    </S.DetailsFormWrapper>

    <S.PreviewWrapper>
      <DetailsPreview
        bannerURL={editData?.bannerImageUrl}
        logoURL={editData?.logoImageUrl}
        name={editData?.name}
        subtitle={editData?.subtitle}
        description={editData?.description}
      />
    </S.PreviewWrapper>
  </S.DetailsContainer>
);

export default Details;
