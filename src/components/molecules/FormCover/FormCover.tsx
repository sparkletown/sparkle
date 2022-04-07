import React from "react";

import LoadingIcon from "assets/icons/icon-loading.svg";

export interface FormCoverProps {
  displayed?: boolean;
}

export const FormCover: React.FC<FormCoverProps> = ({ displayed, children }) =>
  displayed ? (
    <div data-bem="FormCover">
      <div data-bem="FormCover__overlay">
        <img data-bem="FormCover__spinner" src={LoadingIcon} alt="loading" />
      </div>
      {children}
    </div>
  ) : (
    <>{children}</>
  );
