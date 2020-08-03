import React, { useMemo, useCallback } from "react";
import WithNavigationBar from "components/organisms/WithNavigationBar";
import "./Venue.scss";
import { TemplateForm } from "./TemplateForm";
import { DetailsForm } from "./DetailsForm";
import { useHistory } from "react-router-dom";
import { useQuery } from "hooks/useQuery";

export interface WizardPage {
  next?: () => void;
  previous?: () => void;
}

export const VenueWizard: React.FC = () => {
  const history = useHistory();
  const queryParams = useQuery();

  const queryPageString = queryParams.get("page");
  const queryPage = queryPageString ? parseInt(queryPageString) : 1;

  const next = useCallback(
    () => history.push(`${history.location.pathname}?page=${queryPage + 1}`),
    [history, queryPage]
  );
  const previous = useCallback(
    () => history.push(`${history.location.pathname}?page=${queryPage - 1}`),
    [history, queryPage]
  );

  const Page = useMemo(() => {
    switch (queryPage) {
      case 1:
        return <TemplateForm next={next} />;
      case 2:
        return <DetailsForm previous={previous} />;
      default:
        return <TemplateForm next={next} />;
    }
  }, [queryPage, next, previous]);

  return <WithNavigationBar>{Page}</WithNavigationBar>;
};
