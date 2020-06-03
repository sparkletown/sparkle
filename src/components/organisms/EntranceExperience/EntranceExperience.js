import React, { useState } from "react";
import { useFirebase } from "react-redux-firebase";
import NavBar from "components/molecules/NavBar";
import InformationCard from "components/molecules/InformationCard";
import { getTimeBeforeParty } from "utils/time";
import "./EntranceExperience.scss";

const EntranceExperience = (props) => {
  const firebase = useFirebase();

  const [invalidPassword, setInvalidPassword] = useState();
  const [error, setError] = useState();
  const [password, setPassword] = useState();
  const [name, setName] = useState();
  const [message, setMessage] = useState();

  function passwordChanged(e) {
    setPassword(e.target.value);
    setInvalidPassword(false);
    setError(false);
  }

  function passwordSubmitted(e) {
    e.preventDefault();
    setMessage("Checking password...");

    const checkPassword = firebase.functions().httpsCallable("checkPassword");
    checkPassword({ password: password })
      .then(() => {
        setInvalidPassword(false);
        setMessage("Password OK! Proceeding...");

        firebase
          .auth()
          .signInAnonymously()
          .catch((error) => {
            setError(true);
          });
      })
      .catch(() => {
        setInvalidPassword(true);
        setMessage(null);
      });
  }

  function nameChanged(e) {
    setName(e.target.value);
    setInvalidPassword(false);
    setError(false);
  }

  function nameSubmitted(e) {
    e.preventDefault();

    props.updateProfile({
      displayName: name,
    });
  }

  return (
    <>
      <NavBar />
      <div className="container">
        <div className="row mt-3">
          <div className="col">
            <h1 className="title">The Boat Party</h1>
            <div className="subtitle-container">
              <img
                className="collective-icon"
                src="collective-icon.png"
                alt="Co-Reality collective"
                width="20"
                height="20"
              />
              <div>
                Hosted by{" "}
                <a href="https://co-reality.co/">Co-Reality collective</a>{" "}
                <br />
                <div className="secondary-color">
                  Party begins in {getTimeBeforeParty()}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-xl-7">
            <img
              src="boatparty.jpeg"
              className="map-image"
              alt="The boat party"
            />
          </div>
          <div className="col-xl-5">
            <InformationCard title="About this party">
              Are you feeling lost on the mainland? Aching for freedom, novel
              connection, and the chance to let your freak flag fly? Your wish
              is our command. Come travel the high seas with the Co-Reality
              Collective on our fifth esoteric adventure: The Boat Party -- A
              Voyage of Discovery. Join hundreds of fellow explorers on this
              journey of self-discovery; explore the deepest vessels of yourself
              that have been yearning to break free; and tackle the riddle on a
              collective quest for the ultimate treasure chest. Meet us at the
              Dock of the Bay, pack your sunscreen and say -- “Bon Voyage!” to
              the old you!
            </InformationCard>
            <InformationCard title="About the host">
              <p>
                The Co-Reality Collective organises some of the realest parties
                online. A decentralised international oragnisation of fifty
                artists, party philosophers, performers, and peripatetic
                citizens, Co-Reality seek to bring people together in
                thought-provoking online spaces and to explore the limits of
                what is possible in this new medium of experience. Their four
                online parties have been praised from Norway to Bangkok.
              </p>
              <img
                className="collective-icon"
                src="collective-icon.png"
                alt="Co-Reality collective"
                width="20"
                height="20"
              />
              <a href="https://co-reality.co/">Co-Reality collective</a>
            </InformationCard>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col">
            {!props.user ? (
              <>
                <h2>Enter the Password</h2>
                <p>
                  By now, you should have received an email with the password.{" "}
                  <a
                    href="https://co-reality.co/help"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Need help?
                  </a>
                </p>
                <form onSubmit={passwordSubmitted}>
                  <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                      autoFocus
                      onChange={passwordChanged}
                      className={
                        "form-control" + (invalidPassword ? " is-invalid" : "")
                      }
                      id="password"
                      placeholder="Password"
                    />
                    {invalidPassword && (
                      <div className="invalid-feedback">
                        Incorrect password.{" "}
                        <a
                          href="https://co-reality.co/help"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Need help?
                        </a>
                      </div>
                    )}
                    {error && (
                      <div className="invalid-feedback">
                        Error occurred: {error}. Try again or{" "}
                        <a
                          href="https://co-reality.co/help"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Ask for help
                        </a>
                        .
                      </div>
                    )}
                    <small id="emailHelp" className="form-text text-muted">
                      Please enter the password from your email.{" "}
                      <a
                        href="https://co-reality.co/help"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Click here for help.
                      </a>
                    </small>
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                  <div className="form-group">
                    {message && <small>{message}</small>}
                  </div>
                </form>
              </>
            ) : (
              <>
                <h2>Enter Your Name</h2>
                <p>What will you be known as during the party?</p>
                <form onSubmit={nameSubmitted}>
                  <div className="form-group">
                    <label htmlFor="name">Your Name:</label>
                    <input
                      onChange={nameChanged}
                      className="form-control"
                      id="name"
                      placeholder="Your Name"
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default EntranceExperience;
