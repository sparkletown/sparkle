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
  dispatch,
  data,
  onSave,
}) => (
  <S.DetailsContainer>
    <S.DetailsFormWrapper>
      <DetailsForm
        previous={previous}
        editData={data}
        dispatch={dispatch}
        onSave={onSave}
      />
    </S.DetailsFormWrapper>

    <S.PreviewWrapper>
      <DetailsPreview {...data} />
    </S.PreviewWrapper>
  </S.DetailsContainer>
);

export default Details;
