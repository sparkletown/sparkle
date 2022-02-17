import React from "react";

import { spaceCreateItemSelector } from "utils/selectors";

import { useSelector } from "hooks/useSelector";

import "./PortalShowcase.scss";

export const PortalShowcase: React.FC = () => {
  const selectedItem = useSelector(spaceCreateItemSelector);

  if (!selectedItem?.poster) {
    return (
      <section className="PortalShowcase">
        <div className="PortalShowcase__poster PortalShowcase__poster--default" />
      </section>
    );
  }

  return (
    <section className="PortalShowcase">
      <div className="PortalShowcase__description">
        {selectedItem.description}
      </div>
      {
        <img
          className="PortalShowcase__poster PortalShowcase__poster--selected"
          src={selectedItem.poster}
          alt="poster representing the selected portal"
        />
      }
    </section>
  );
};
