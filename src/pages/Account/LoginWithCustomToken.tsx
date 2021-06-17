import React from "react";
import { useFirebase } from "react-redux-firebase";
import { useHistory, useParams } from "react-router-dom";
import { useAsync } from "react-use";

import { enterVenue } from "utils/url";

import { LoadingPage } from "components/molecules/LoadingPage";

import "./Account.scss";

export interface LoginCustomCodeProps {}

export const LoginWithCustomToken: React.FC<LoginCustomCodeProps> = () => {
  const { venueId, customToken } = useParams<{
    venueId?: string;
    customToken?: string;
  }>();

  const firebase = useFirebase();

  const { replace: replaceUrlUsingRouter } = useHistory();

  const { loading: isCustomTokenLoginLoading, error } = useAsync(async () => {
    if (!venueId || !customToken)
      throw new Error("venueId and customToken are required");

    if (firebase.auth().currentUser)
      throw new Error("there is already a logged in user");

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
        enterVenue(venueId, { customOpenRelativeUrl: replaceUrlUsingRouter });
      });
  }, [venueId, customToken, firebase, replaceUrlUsingRouter]);

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
