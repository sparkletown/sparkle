import React from "react";

import LoadingIcon from "assets/icons/icon-loading.svg";

import "./FormCover.scss";

export interface FormCoverProps {
  displayed?: boolean;
}

export const FormCover: React.FC<FormCoverProps> = ({ displayed, children }) =>
  displayed ? (
    <div className="FormCover">
      <div className="FormCover__overlay">
        <img className="FormCover__spinner" src={LoadingIcon} alt="loading" />
      </div>
      {children}
    </div>
  ) : (
    <>{children}</>
  );
