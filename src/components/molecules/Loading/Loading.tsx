import React, { FC } from "react";

import LoadingIcon from "assets/icons/icon-loading.svg";

import "./Loading.scss";

export interface LoadingProps {
  message?: string;
}

export const Loading: FC<LoadingProps> = ({ message }) => {
  return (
    <div className="Loading">
      <img className="Loading__icon" src={LoadingIcon} alt="loading" />
      <span className="Loading__message">{message}</span>
    </div>
  );
};
