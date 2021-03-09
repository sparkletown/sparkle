/* eslint-disable no-undef */
describe("First Test", function () {
  it("can log in and out", () => {
    cy.visit("https://staging.sparkle.space/in/devaliashacksville");
    cy.clearCookies();

    cy.get(".login-button")
      .click();

    cy.get(".form > .input-group:nth-child(1) > input")
      .type('malaika.aiyar@gmail.com');

    cy.get(".form > .input-group:nth-child(2) > input")
      .type('QWE#qwe3');

    cy.get('.form > .btn')
      .click();

    cy.get('.navbar-link-profile')
      .click();

    cy.get(".popover-body > .profile-modal-container > input:nth-child(8)")
      .click();

    cy.location('pathname').should('eq', '/v/devaliashacksville');
  });

  it("can visit and interact with the jazzbar", () => {

    // visiting site
    cy.visit("https://staging.sparkle.space/in/devaliashacksville");
    cy.clearCookies();

    // logging in again
    cy.get(".login-button")
      .click();

    cy.get(".form > .input-group:nth-child(1) > input")
      .type('malaika.aiyar@gmail.com');

    cy.get(".form > .input-group:nth-child(2) > input")
      .type('QWE#qwe3');

    cy.get('.form > .btn')
      .click();

    // getting into jazzbar

    cy.get(".maproom")
      .contains("Jazz Bar")
      .parent()
      .parent()
      .click();

    cy.get('.room-modal-ongoing-event-container > .room-entry-button')
      .click();

    cy.location('pathname').should('eq', '/in/devaliasjazzbar');

    // interact with video ...

    // go to a table
    cy.get('.music-bar-content > .jazzbar-table-component-container')
      .each(($el) => {
        cy.get('.chat-sidebar__controller')
          .click();

        // enter table room
        cy.wrap($el).get('.table-item > .add-participant-button')
          .first()
          .click();
        cy.get('.modal-container > .btn')
          .click();

        // interact with table and video ...

        // leave table
        cy.get('.back-button-container > .back-button')
          .click();
    });


    // logging back out

    cy.get('.navbar-link-profile')
      .click();

    cy.get(".popover-body > .profile-modal-container > input:nth-child(8)")
      .click();

    cy.location('pathname').should('eq', '/v/devaliashacksville');

  });

});
