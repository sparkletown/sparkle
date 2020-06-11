import React, { Fragment } from "react";
import { useFirebase } from "react-redux-firebase";

export default function LockedSite() {
  const firebase = useFirebase();
  firebase.auth().signOut();

  return (
    <Fragment>
      <header>
        <nav className="navbar fixed-top navbar-expand-lg navbar-dark bg-dark">
          <span className="navbar-brand">Co-Reality Collective</span>
        </nav>
      </header>
      <div className="container">
        <div className="row mt-3">
          <div className="col">
            <h2>Thanks For Attending the Party!</h2>
            <p>
              <a href="https://co-reality.co/">(Homepage)</a>
            </p>
            <p>Dear partygoer,</p>
            <p>
              Thank you for coming to the party. we hope you enjoyed yourself.
              Most of all we thank you for bringing your beautiful self - your
              presence helped co-create this experience for everyone.
            </p>
            <p>We have a favour to ask:</p>
            <p>We'd love your feedback about your experience:</p>
            <p>
              <a
                href="https://forms.gle/EXcPPEbYgsNy75CE7"
                target="_blank"
                rel="noopener noreferrer"
              >
                FEEDBACK FORM
              </a>
            </p>
            <p>
              We'll use any feedback you leave to help make future parties even
              better and to rationalise feasting on forest fruits.
            </p>
            <p>
              If you haven't already, please{" "}
              <a
                href="https://www.facebook.com/corealitycollective"
                target="_blank"
                rel="noopener noreferrer"
              >
                Like Us On Facebook
              </a>{" "}
              and join our community we can inform you about future events.
            </p>
            <p>
              As you know, all proceeds for this party go to artists-in-need or
              charities. If you'd like to donate to them, we welcome this too{" "}
              <a
                href="https://paypal.com/corealitycollective"
                target="_blank"
                rel="noopener noreferrer"
              >
                HERE
              </a>
              .
            </p>
            <p>We look forward to seeing more of you.</p>
            <p>With love,</p>
            <p>
              The Co-Reality Collective Team{" "}
              <span role="img" aria-label="Heart">
                ❤️
              </span>
            </p>
            <p>PS: We can't wait to see you again.</p>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
