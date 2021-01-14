import React, { useState } from "react";
import firebase from "firebase/app";
import { useFirestoreConnect } from "hooks/useFirestoreConnect";
import { IFRAME_ALLOW, PLAYA_VENUE_NAME } from "settings";
import { ValidFirestoreRootCollections } from "types/Firestore";

const WelcomePage: React.FunctionComponent = () => {
  // @debt we should remove this code file if it's not being used anymore
  useFirestoreConnect("marketingemails" as ValidFirestoreRootCollections);
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [emailSubmitError, setEmailSubmitError] = useState(null);

  const emailChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailSubmitted(false);
    setEmailSubmitError(null);
  };

  const submitEmail = (e: React.MouseEvent<HTMLInputElement>) => {
    e.preventDefault();
    const doc = `marketingemails/${email}`;
    const update = {
      ts_utc: firebase.firestore.Timestamp.fromDate(new Date()),
    };

    const firestore = firebase.firestore();
    firestore
      .doc(doc)
      .update(update)
      .then(() => {
        setEmail("");
        setEmailSubmitted(true);
        setEmailSubmitError(null);
      })
      .catch(() => {
        firestore
          .doc(doc)
          .set(update)
          .then(() => {
            setEmail("");
            setEmailSubmitted(true);
            setEmailSubmitError(null);
          })
          .catch((e) => {
            setEmailSubmitted(false);
            setEmailSubmitError(e.toString());
          });
      });
  };

  return (
    <>
      <div className="hero">
        <p className="hero-text">
          Welcome to the SparkleVerse{" "}
          <span role="img" aria-label="sparkle emoji">
            ✨
          </span>
        </p>
        <div className="subtitle">
          Help co-create a decentralised experimental city in the Multiverse
          with fellow burners from around the world
        </div>
      </div>
      <div className="info-wrapper">
        <h3 className="card-wrapper-title">How the Sparkleverse works:</h3>
        <div className="row card-container">
          <div className="col-md-4">
            <div className="info-card">
              <h3 className="card-title">1. Digital {PLAYA_VENUE_NAME} Map</h3>
              <img
                className="image-in-card"
                src="/marketing-page/digital-playa-map.jpg"
                title={`Digital ${PLAYA_VENUE_NAME} Map image`}
                alt={`Digital ${PLAYA_VENUE_NAME} Map`}
              />
              <p>
                A 2-D browser-based map for roaming in shared adventures through
                an integrated patchwork quilt of places and experiences
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="info-card">
              <h3 className="card-title">
                2. Easy, powerful tools to create magic
              </h3>
              <img
                className="image-in-card"
                src="/marketing-page/powerful-tools.jpg"
                title="Powerful tools image"
                alt="Powerful tools"
              />
              <p>
                Populate the {PLAYA_VENUE_NAME} with your camp, art, host
                performances (DJs, talks) etc using simple yet powerful
                space-creation tools and templates
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="info-card">
              <h3 className="card-title">3. Community education + support</h3>
              <img
                className="image-in-card"
                src="/marketing-page/community-education.jpg"
                title="Community education image"
                alt="Community education"
              />
              <p>
                Forums, examples, templates and community support to help you
                add your magic to the Sparkleverse for others to enjoy
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="interested-contributors">
        <div className="interested-contribtors-text">
          Interested to connect, learn more or participate:
        </div>
        <input
          type="text"
          placeholder="Enter your email"
          value={email}
          onChange={emailChanged}
        />
        <input
          className="btn btn-primary submit-btn"
          type="submit"
          onClick={submitEmail}
          disabled={emailSubmitted}
          id="marketing-page-submit-email"
        />
        {emailSubmitted && (
          <span className="input-info">
            Thanks for submitting your email! We will be in touch shortly.
          </span>
        )}
        {emailSubmitError && (
          <span className="input-error">
            Error submitting your email: {emailSubmitError}. Please try again.
          </span>
        )}
      </div>

      <div className="info-wrapper">
        <h3>Watch the video for a quick introduction to our approach</h3>
        <div className="video-container">
          <iframe
            title="Our approach to Burning Man"
            className="video"
            src="https://www.youtube.com/embed/0FvFcO5Oq_k"
            frameBorder="0"
            allow={IFRAME_ALLOW}
            allowFullScreen
          ></iframe>
        </div>
        <button
          className="btn btn-primary btn-block btn-centered help-build-button"
          onClick={() =>
            window.open(
              "https://docs.google.com/forms/d/e/1FAIpQLSeGGsafBOnO63GOiPjBhIdFaEqoM0xBSERdkTEqh3DrPteQvw/viewform"
            )
          }
          id="marketing-page-google-form"
        >
          Help build the SparkleVerse
        </button>
      </div>
    </>
  );
};

export default WelcomePage;
