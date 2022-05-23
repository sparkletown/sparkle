import Bugsnag from "@bugsnag/js";
import firebase from "firebase/compat/app";

const providerGoogle = new firebase.auth.GoogleAuthProvider();

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

export const useSocialSignIn = () => ({ signInWithGoogle });
