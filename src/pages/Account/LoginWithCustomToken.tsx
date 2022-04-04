import React from "react";
import { useHistory, useParams } from "react-router-dom";
import { useAsync } from "react-use";
import firebase from "firebase/compat/app";

import { SpaceSlug, WorldSlug } from "types/id";

import { createErrorCapture } from "utils/error";
import { enterSpace } from "utils/url";

import { useUserId } from "hooks/user/useUserId";

import { LoadingPage } from "components/molecules/LoadingPage";

import sparkleHeaderImage from "assets/images/sparkle-header.png";

export interface LoginCustomCodeProps {}

export const LoginWithCustomToken: React.FC<LoginCustomCodeProps> = () => {
  const { worldSlug, spaceSlug, customToken } = useParams<{
    spaceSlug?: SpaceSlug;
    worldSlug?: WorldSlug;
    customToken?: string;
  }>();

  const { userId } = useUserId();

  const isLoggedInUser = !!userId;

  const { replace: replaceUrlUsingRouter } = useHistory();

  const { loading: isCustomTokenLoginLoading, error } = useAsync(async () => {
    if (!spaceSlug || !worldSlug || !customToken)
      throw new Error("spaceSlug, worldSlug and customToken are required");

    if (isLoggedInUser) throw new Error("there is already a logged in user");

    // @debt: move this into api/auth or similar?
    await firebase
      .auth()
      .signInWithCustomToken(customToken)
      .catch(
        createErrorCapture({
          message: "Sign in with custom token failed",
          where: "LoginWithCustomToken",
        })
      )
      .then(() => {
        enterSpace(worldSlug, spaceSlug, {
          customOpenRelativeUrl: replaceUrlUsingRouter,
        });
      });
  }, [
    isLoggedInUser,
    worldSlug,
    spaceSlug,
    customToken,
    replaceUrlUsingRouter,
  ]);

  if (isCustomTokenLoginLoading) return <LoadingPage />;

  return (
    <div className="auth-container">
      <div className="logo-container">
        <img src={sparkleHeaderImage} alt="" width="100%" />
      </div>

      {error && <div>Error: {error.message}</div>}
    </div>
  );
};
