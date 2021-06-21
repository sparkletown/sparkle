import React from "react";

import { venueInsideUrl } from "utils/url";

import { RelatedVenuesProvider } from "hooks/useRelatedVenues";

import { Button } from "components/atoms/Button";
import { NavSearchBar } from "components/molecules/NavSearchBar";

import "./RunTabToolbar.scss";

export interface RunTabToolbarProps {
  venueId?: string;
}

export const RunTabToolbar: React.FC<RunTabToolbarProps> = ({ venueId }) => (
  <div className="RunTabToolbar__wrapper">
    <div className="RunTabToolbar__toolbar RunTabToolbar__toolbar--left">
      <Button
        isLink={true}
        linkTo={venueId ? venueInsideUrl(venueId) : undefined}
        customClass="btn btn-block"
        newTab={true}
      >
        Everyone
      </Button>
      <RelatedVenuesProvider venueId={venueId}>
        <NavSearchBar venueId={venueId ?? ""} />
      </RelatedVenuesProvider>
    </div>
    <div className="RunTabToolbar__toolbar RunTabToolbar__toolbar--right">
      <Button
        isLink={true}
        linkTo={venueId ? venueInsideUrl(venueId) : undefined}
        customClass="btn btn-primary btn-block"
        newTab={true}
      >
        Visit Space
      </Button>
    </div>
  </div>
);
