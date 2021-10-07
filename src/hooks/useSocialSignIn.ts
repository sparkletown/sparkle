import Bugsnag from "@bugsnag/js";
import firebase from "firebase/app";

const providerGoogle = new firebase.auth.GoogleAuthProvider();
const providerFb = new firebase.auth.FacebookAuthProvider();

const updateUserEmail = () => {
  const currentUser = firebase?.auth()?.currentUser;
  const [providerData] = currentUser?.providerData ?? [];
  const userName =
    currentUser?.displayName?.toLowerCase().replaceAll(" ", "") ?? "undefined";

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
