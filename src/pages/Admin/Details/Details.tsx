import React from "react";

import { DetailsProps } from "./Details.types";
import DetailsForm from "./Form";
import DetailsPreview from "./Preview";

import "../Venue/Venue.scss";
import "./Details.scss";

const Details: React.FC<DetailsProps> = ({ previous, dispatch, data }) => (
  <div className="Details Details__container">
    <div className="Details__wrapper Details__form-wrapper">
      <DetailsForm previous={previous} editData={data} dispatch={dispatch} />
    </div>

    <div className="Details__wrapper Details__preview-wrapper">
      <DetailsPreview {...data} />
    </div>
  </div>
);

export default Details;
