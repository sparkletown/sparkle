import React from "react";

import * as S from "./Details.styles";
// Typings
import { DetailsProps } from "./Details.types";
// Components
import DetailsForm from "./Form";
import DetailsPreview from "./Preview";

// Styles
import "../Venue/Venue.scss";

const Details: React.FC<DetailsProps> = ({ previous, dispatch, data }) => (
  <S.DetailsContainer>
    <S.DetailsFormWrapper>
      <DetailsForm previous={previous} editData={data} dispatch={dispatch} />
    </S.DetailsFormWrapper>

    <S.PreviewWrapper>
      <DetailsPreview {...data} />
    </S.PreviewWrapper>
  </S.DetailsContainer>
);

export default Details;
