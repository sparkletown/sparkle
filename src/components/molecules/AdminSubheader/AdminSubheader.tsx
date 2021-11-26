import React from "react";

import "./AdminSubheader.scss";

export interface AdminSubheaderProps {
  title?: string;
  leftComponent?: JSX.Element;
  rightComponent?: JSX.Element;
}

export const AdminSubheader: React.FC<AdminSubheaderProps> = ({
  title,
  leftComponent,
  rightComponent,
}) => {
  return (
    <div className="AdminSubheader">
      {leftComponent}
      {/* {!backButton && <ButtonNG iconName={faArrowLeft} onClick={() => { }} >Back to Dashboard</ButtonNG>} */}
      <div className="AdminSubheader__row">
        <div className="AdminSubheader__title">{title}</div>

        <div className="AdminSubheader__right-component">{rightComponent}</div>
      </div>
    </div>
  );
};
