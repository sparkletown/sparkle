import Bugsnag from "@bugsnag/js";
import firebase from "firebase/app";

const providerGoogle = new firebase.auth.GoogleAuthProvider();
const providerFb = new firebase.auth.FacebookAuthProvider();

export const useSocialSignIn = () => {
  const signInWithGoogle = () =>
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
      });

  const signInWithFacebook = () =>
    firebase
      .auth()
      .signInWithPopup(providerFb)
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
      });

  return { signInWithGoogle, signInWithFacebook };
};
