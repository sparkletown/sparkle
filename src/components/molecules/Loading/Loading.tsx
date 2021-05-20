import React from "react";

import LoadingIcon from "assets/icons/icon-loading.svg";

import "./Loading.scss";

export interface LoadingProps {
  label?: string;
}

export const Loading: React.FC<LoadingProps> = ({ label }) => {
  return (
    <div className="Loading">
      <img className="Loading__icon" src={LoadingIcon} alt="loading" />
      <span className="Loading__message">{label}</span>
    </div>
  );
};
