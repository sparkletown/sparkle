import Bugsnag from "@bugsnag/js";
import firebase from "firebase/app";

const providerGoogle = new firebase.auth.GoogleAuthProvider();
const providerFb = new firebase.auth.FacebookAuthProvider();

// @debt temporary user email update since facebook returns empty email in user/providerData
// https://stackoverflow.com/a/20594547/7785277
const updateUserEmail = () => {
  const currentUser = firebase?.auth()?.currentUser;
  const [providerData] = currentUser?.providerData ?? [{ uid: "" }];
  const lettersAndNumbersRegex = /[^a-zA-Z0-9]+/g;
  const userName = currentUser?.displayName?.replace(
    lettersAndNumbersRegex,
    ""
  );
  const nameValue = providerData?.uid ?? userName;

  if (!nameValue) {
    const error = new Error("Failed to update user email");
    Bugsnag.notify(error, (event) => {
      event.addMetadata("context", {
        location: "hooks/useSocialSignIn::updateUserEmail",
        message: "Social provider or username is empty",
      });
    });
    return;
  }
  currentUser?.updateEmail(`${providerData?.uid ?? userName}@facebook.auth`);
};

const signInWithGoogle: () => Promise<firebase.auth.UserCredential> = () =>
  firebase
    .auth()
    .signInWithPopup(providerGoogle)
    .catch((error) => {
      const { code, message, email, credential } = error;

      Bugsnag.notify(error, (event) => {
        event.addMetadata("context", {
          location: "hooks/useSocialSignIn::signInWithGoogle",
          providerGoogle,
          code,
          message,
          email,
          credential,
        });
      });

      return error;
    });

const signInWithFacebook: () => Promise<firebase.auth.UserCredential> = () =>
  firebase
    .auth()
    .signInWithPopup(providerFb)
    .then((res) => {
      const { user } = res;
      if (user && !user.emailVerified) {
        updateUserEmail();
      }
    })
    .catch((error) => {
      const { code, message, email, credential } = error;
      Bugsnag.notify(error, (event) => {
        event.addMetadata("context", {
          location: "hooks/useSocialSignIn::signInWithFacebook",
          providerFb,
          code,
          message,
          email,
          credential,
        });
      });

      return error;
    });

export const useSocialSignIn = () => ({ signInWithGoogle, signInWithFacebook });
