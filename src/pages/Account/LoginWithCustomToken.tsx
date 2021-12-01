import React from "react";
import { useFirebase } from "react-redux-firebase";
import { useHistory, useParams } from "react-router-dom";
import { useAsync } from "react-use";

import { isDefined } from "utils/types";
import { enterVenue } from "utils/url";

import { useUser } from "hooks/useUser";

import { LoadingPage } from "components/molecules/LoadingPage";

import "./Account.scss";

export interface LoginCustomCodeProps {}

export const LoginWithCustomToken: React.FC<LoginCustomCodeProps> = () => {
  const { worldSlug, spaceSlug, customToken } = useParams<{
    spaceSlug?: string;
    worldSlug?: string;
    customToken?: string;
  }>();

  const { user } = useUser();

  const isLoggedInUser = isDefined(user);

  const firebase = useFirebase();

  const { replace: replaceUrlUsingRouter } = useHistory();

  const { loading: isCustomTokenLoginLoading, error } = useAsync(async () => {
    if (!spaceSlug || !worldSlug || !customToken)
      throw new Error("spaceSlug, worldSlug and customToken are required");

    if (isLoggedInUser) throw new Error("there is already a logged in user");

    // @debt: move this into api/auth or similar?
    await firebase
      .auth()
      .signInWithCustomToken(customToken)
      // .catch((error) => {
      //   // TODO: Handle this with Bugsnag or similar?
      //   console.error(error);
      //
      //   throw error;
      // });
      .then(() => {
        enterVenue(worldSlug, spaceSlug, {
          customOpenRelativeUrl: replaceUrlUsingRouter,
        });
      });
  }, [
    isLoggedInUser,
    worldSlug,
    spaceSlug,
    customToken,
    firebase,
    replaceUrlUsingRouter,
  ]);

  if (isCustomTokenLoginLoading) return <LoadingPage />;

  return (
    <div className="auth-container">
      <div className="logo-container">
        <img src="/sparkle-header.png" alt="" width="100%" />
      </div>

      {error && <div>Error: {error.message}</div>}
    </div>
  );
};
