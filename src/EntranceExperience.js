import React, { useState, Fragment } from 'react';
import { useFirebase } from 'react-redux-firebase';

export default function EntranceExperience({ user }) {
  const firebase = useFirebase();

  const [invalidPassword, setInvalidPassword] = useState();
  const [error, setError] = useState();
  const [success, setSuccess] = useState();
  const [password, setPassword] = useState();
  const [name, setName] = useState();

  const passwordChanged = (e) => {
    setPassword(e.target.value);
    setInvalidPassword(false);
    setError(false);    
  }

  const passwordSubmitted = (e) => {
    e.preventDefault();

    const checkPassword = firebase.functions().httpsCallable('checkPassword');
    checkPassword({password: password})
      .then(() => {
        setInvalidPassword(false);
        setSuccess(true)

        firebase.auth()
          .signInAnonymously()
          .catch(error => {
            setError(true);
          });
      })
      .catch(() => {
        setInvalidPassword(true)
      });
  }

  const nameChanged = (e) => {
    setName(e.target.value);
    setInvalidPassword(false);
    setError(false);
  }

  const nameSubmitted = (e) => {
    e.preventDefault();

    user.updateProfile({
      displayName: name,
    });
  }

  return (
    <Fragment>
      <header>
        <nav className="navbar fixed-top navbar-expand-lg navbar-dark bg-dark">
          <span className="navbar-brand">
            Roots to Rapture: Party in the Tree of Life
          </span>
        </nav>
      </header>
      <div className="container">
          <div className="row mt-3">
            <div className="col">
              {!user ? 
                <Fragment>
                  <h2>Enter the Password</h2>
                  <p>
                    By now, you should have received an email with the password. <a href="https://co-reality.co/help" target="_blank" rel="noopener noreferrer">Need help?</a>
                  </p>
                  <form onSubmit={passwordSubmitted}>
                    <div className="form-group">
                      <label htmlFor="password">
                        Password:
                      </label>
                      <input onChange={passwordChanged}
                        className={"form-control" + (invalidPassword ? " is-invalid" : "")}
                        id="password"
                        placeholder="Password"/>
                      {invalidPassword &&
                        <div className="invalid-feedback">
                          Incorrect password. <a href="https://co-reality.co/help" target="_blank" rel="noopener noreferrer">Need help?</a>
                        </div>
                      }
                      {error &&
                       <div className="invalid-feedback">
                          Error occurred: {error}. Try again or <a href="https://co-reality.co/help" target="_blank" rel="noopener noreferrer">Ask for help</a>.
                        </div> 
                      }
                      <small id="emailHelp" className="form-text text-muted">
                        Please enter the password from your email. <a href="https://co-reality.co/help" target="_blank" rel="noopener noreferrer">Click here for help.</a>
                      </small>
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                    <div className="form-group">
                      {success &&
                        <small>Password OK! Proceeding...</small>
                      }
                    </div>
                  </form>
                </Fragment>
                :
                <Fragment>
                  <h2>Enter Your Name</h2>
                  <p>
                    What will you be known as during the party?
                  </p>
                  <form onSubmit={nameSubmitted}>
                    <div className="form-group">
                      <label htmlFor="name">
                        Your Name:
                      </label>
                      <input onChange={nameChanged}
                        className="form-control"
                        id="name"
                        placeholder="Your Name"/>
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                  </form>
                </Fragment>
              }
            </div>
          </div>
        </div>
    </Fragment>
  );
}