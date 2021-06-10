import React, { FC, useState } from "react";
import { useFirebase } from "react-redux-firebase";
import { useHistory } from "react-router-dom";
import { useAsync } from "react-use";

import { InitialForm } from "components/organisms/AuthenticationModal/InitialForm";
import LoginForm from "components/organisms/AuthenticationModal/LoginForm";
import PasswordResetForm from "components/organisms/AuthenticationModal/PasswordResetForm";
import RegisterForm from "components/organisms/AuthenticationModal/RegisterForm";

import { LoadingPage } from "components/molecules/LoadingPage";

import "./Account.scss";

interface LoginProps {
  formType?: "initial" | "login" | "register" | "passwordReset";
}

export const Login: FC<LoginProps> = ({ formType = "initial" }) => {
  const [formToDisplay, setFormToDisplay] = useState(formType);

  const displayLoginForm = () => {
    setFormToDisplay("login");
  };

  const displayRegisterForm = () => {
    setFormToDisplay("register");
  };

  const displayPasswordResetForm = () => {
    setFormToDisplay("passwordReset");
  };

  const redirectAfterLogin = () => {};

  // If there is a customToken param in the URL, use that to login
  const firebase = useFirebase();
  const {
    replace: replaceUrlUsingRouter,
    location: { search },
  } = useHistory();
  const { loading: isCustomTokenLoginLoading } = useAsync(async () => {
    const customToken = new URLSearchParams(search).get("customToken");

    if (!customToken) return;

    // @debt: move this into api/auth or similar?
    await firebase.auth().signInWithCustomToken(customToken);
    // .catch((error) => {
    //   // TODO: Handle this with Bugsnag or similar?
    //   console.error(error);
    //
    //   throw error;
    // });

    // Remove customToken from the url params
    const currentUrlWithoutCustomToken = new URL(window.location.pathname);
    currentUrlWithoutCustomToken.search = window.location.search;
    currentUrlWithoutCustomToken.searchParams.delete("customToken");
    // @debt This should work, but it doesn't seem to be properly updating the URL for some reason. Bug with react-router's replace method?
    replaceUrlUsingRouter(currentUrlWithoutCustomToken.toString());

    // @debt I feel like it would be better to explicitly redirect somewhere once we have logged in.. but our other signIn
    //  code in LoginForm doesn't seem to..
  }, [firebase, replaceUrlUsingRouter, search]);

  if (isCustomTokenLoginLoading) return <LoadingPage />;

  return (
    <div className="auth-container">
      <div className="logo-container">
        <img src="/sparkle-header.png" alt="" width="100%" />
      </div>
      <div className="auth-form-container">
        {formToDisplay === "initial" && (
          <InitialForm
            displayLoginForm={displayLoginForm}
            displayRegisterForm={displayRegisterForm}
          />
        )}
        {formToDisplay === "register" && (
          <RegisterForm
            displayLoginForm={displayLoginForm}
            displayPasswordResetForm={displayPasswordResetForm}
            afterUserIsLoggedIn={redirectAfterLogin}
            closeAuthenticationModal={() => null}
          />
        )}
        {formToDisplay === "login" && (
          <LoginForm
            displayRegisterForm={displayRegisterForm}
            displayPasswordResetForm={displayPasswordResetForm}
            closeAuthenticationModal={() => null}
            afterUserIsLoggedIn={redirectAfterLogin}
          />
        )}
        {formToDisplay === "passwordReset" && (
          <PasswordResetForm
            displayLoginForm={displayLoginForm}
            closeAuthenticationModal={redirectAfterLogin}
          />
        )}
      </div>
    </div>
  );
};

export default Login;
