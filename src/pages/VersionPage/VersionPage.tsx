import React from "react";

import {
  BUILD_BRANCH,
  BUILD_PULL_REQUESTS,
  BUILD_REPOSITORY_URL,
  BUILD_SHA1,
  BUILD_TAG,
} from "secrets";

import { useUser } from "hooks/useUser";

export const VersionPage: React.FC = () => {
  const { user } = useUser();

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-8 align-self-center">
          <div>BUILD_SHA1 = {BUILD_SHA1}</div>
          <div>BUILD_TAG = {BUILD_TAG}</div>
          <div>BUILD_BRANCH = {BUILD_BRANCH}</div>
          <div>BUILD_REPOSITORY_URL = {BUILD_REPOSITORY_URL}</div>
          <div>BUILD_PULL_REQUESTS = {BUILD_PULL_REQUESTS}</div>
          <div>Current User UID = {user?.uid || "N/A"}</div>
        </div>
      </div>
    </div>
  );
};
