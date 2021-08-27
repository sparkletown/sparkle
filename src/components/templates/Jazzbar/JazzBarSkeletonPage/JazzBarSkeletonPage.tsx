import React from "react";

import "./JazzBarSkeletonPage.scss";

interface PropsType {
  children: React.ReactNode;
}

const JazzBarSkeletonPage: React.FunctionComponent<PropsType> = ({
  children,
}) => {
  return <div className="jazz-bar-container">{children}</div>;
};

export default JazzBarSkeletonPage;
