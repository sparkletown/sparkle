import React, { useState } from "react";
import { useFirebase } from "react-redux-firebase";
import NavBar from "../../molecules/NavBar";
import InformationCard from "../../molecules/InformationCard";
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
            <h1 className="title">The Tree of Life Party</h1>
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
                <div className="secondary-color">Party begins in</div>
              </div>
            </div>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-xl-7">
            <img
              src="treeoflife.jpg"
              className="map-image"
              alt="Tree of Life Party"
            />
          </div>
          <div className="col-xl-5">
            <InformationCard title="About this party">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Vestibulum auctor dolor malesuada est molestie lobortis. Curabitur
              enim nunc, vulputate vel felis eget, semper rutrum nisl. Quisque
              ultrices justo eros, vel commodo felis dictum ut. Donec in
              consectetur ante. Praesent dignissim purus cursus mollis
              tristique. Suspendisse potenti. Nulla ut pharetra purus. Ut
              feugiat non ligula eget vehicula. Pellentesque auctor magna nulla,
              et dapibus mauris finibus non. Quisque cursus lectus placerat
              metus pellentesque efficitur.
            </InformationCard>
            <InformationCard title="About the host">
              <p>
                In massa justo, consequat sed ante at, pharetra scelerisque
                metus. Donec orci elit, rutrum et lacinia dictum, viverra id
                nunc. Pellentesque habitant morbi tristique senectus et netus et
                malesuada fames ac turpis egestas. In ut nisl nisl. Etiam vitae
                quam quis libero luctus porta nec non sem. Aenean a magna eu
                mauris consequat malesuada. Morbi eget turpis vel erat molestie
                volutpat.
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
