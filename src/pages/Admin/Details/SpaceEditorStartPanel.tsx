import React from "react";

import { AdminPanel } from "components/organisms/AdminVenueView/components/AdminPanel";
import { AdminShowcase } from "components/organisms/AdminVenueView/components/AdminShowcase";
import { AdminSidebar } from "components/organisms/AdminVenueView/components/AdminSidebar";

// Typings
import { DetailsProps } from "./Details.types";
// Components
import DetailsForm from "./Form";
import DetailsPreview from "./Preview";

import "./SpaceEditorStartPanel.scss";

export const SpaceEditorStartPanel: React.FC<DetailsProps> = ({
  previous,
  dispatch,
  data,
}) => (
  <AdminPanel className="SpaceEditorStartPanel">
    <AdminSidebar>
      <DetailsForm previous={previous} editData={data} dispatch={dispatch} />
    </AdminSidebar>

    <AdminShowcase>
      <DetailsPreview {...data} />
    </AdminShowcase>
  </AdminPanel>
);
