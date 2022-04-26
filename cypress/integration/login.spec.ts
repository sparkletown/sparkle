// Just a simple test to make sure Cypress is running correctly
// For more info, @see https://on.cypress.io/introduction-to-cypress

import { getByText, getInput } from "cypress/support/util/get";
import { visitSpaceInside } from "cypress/support/util/visit";

type WithSpark = {
  SPARK: { logout: () => void };
};

describe("plain attendee login using pre-seeded DB", () => {
  // these should be pre-seeded into DB
  const worldSlug = "world-01";
  const spaceSlug = "space-01";
  const email = "user-01@some.email";
  const pass = "user-01-some-password";

  beforeEach(() => {
    visitSpaceInside({ worldSlug, spaceSlug });
  });

  afterEach(() => {
    ((cy.window() as unknown) as WithSpark).SPARK.logout();
  });

  it("displays AttendeeLayout upon entering correct credentials", () => {
    getByText("Log In").click();
    getInput("email").type(email);
    getInput("password").type(pass);
    getByText("Log in").click();
  });
});
