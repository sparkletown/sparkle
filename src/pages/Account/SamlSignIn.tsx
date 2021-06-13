import React from "react";
import firebase from "firebase/app";

const signUp = () => {
  const provider = new firebase.auth.SAMLAuthProvider("saml.okta");

  firebase
    .auth()
    .signInWithPopup(provider)
    .then((result) => console.log(result))
    .catch((err) => console.log("error", err));
};

export const SamlSignIn: React.FC = () => {
  console.log(firebase.auth().currentUser);
  // TODO: If there is user, redirect to a venue
  return (
    // TODO: Remove button, use useffect instead
    <div>
      <button onClick={signUp}>Sign in</button>
    </div>
  );
};
