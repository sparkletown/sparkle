// Just a simple test to make sure Cypress is running correctly
// For more info, @see https://on.cypress.io/introduction-to-cypress

import { emulatorsResetFirebase } from "cypress/support/util/db";
import {
  getButton,
  getByBem,
  getByText,
  getInput,
} from "cypress/support/util/get";
import { visitSpaceInside } from "cypress/support/util/visit";

type LogIn = (options: {
  worldSlug: string;
  spaceSlug: string;
  email: string;
  pass: string;
}) => void;

const logIn: LogIn = ({ worldSlug, spaceSlug, email, pass }) => {
  visitSpaceInside({ worldSlug, spaceSlug });
  getByText("Log In").click();
  getInput("email").type(email);
  getInput("password").type(pass);
  getButton("Log in").click();
  getByBem("AttendeeLayout__main").should("exist");
};

describe("plain attendee login using pre-seeded DB", () => {
  // these should be pre-seeded into DB
  const worldSlug = "world-01";
  const spaceSlug = "space-01";
  const email = "user-01@some.email";
  const pass = "user-01-some-password";

  beforeEach(() => {
    emulatorsResetFirebase();
  });

  afterEach(() => {
    // TODO: reset users' auth, they need to be logged out or removed
  });

  // First take makes sure the login works
  it("displays AttendeeLayout upon entering correct credentials - TAKE 1", () => {
    logIn({ worldSlug, spaceSlug, email, pass });
  });

  // Second take makes sure the DB reset works
  // TODO: implement Auth reset similar to how Firestore reset works
  it.skip("displays AttendeeLayout upon entering correct credentials - TAKE 2", () => {
    logIn({ worldSlug, spaceSlug, email, pass });
  });
});
