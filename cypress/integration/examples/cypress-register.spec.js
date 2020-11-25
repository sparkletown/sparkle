// @debt make jest stop complaining that there are no tests here
describe.skip("@debt", () => {
  test("it always passes", () => {
    expect(true).toBe(true);
  });
});
// describe("Smoke Test", function () {
//   it("can create an account and join the kss event", function () {
//     const uniqid = Math.random();
//
//     cy.visit("https://staging.sparkle.space/v/kansassmittys");
//     cy.clearCookies();
//
//     // AUTH
//     cy.get("body > #root > header > .navbar > .log-in-button").click();
//
//     cy.get(
//       ".modal-content > .authentication-modal-container > .form-container > .secondary-action > .link"
//     ).click();
//
//     cy.get(
//       ".authentication-modal-container > .form-container > .form > .input-group:nth-child(1) > .input-block"
//     ).click();
//
//     cy.get(
//       ".authentication-modal-container > .form-container > .form > .input-group:nth-child(1) > .input-block"
//     ).type(`mathieud+${uniqid}@theodo.co.uk`);
//
//     cy.get(
//       ".authentication-modal-container > .form-container > .form > .input-group:nth-child(2) > .input-block"
//     ).click();
//
//     cy.get(
//       ".authentication-modal-container > .form-container > .form > .input-group:nth-child(2) > .input-block"
//     ).type("passw0rd");
//
//     cy.get(
//       ".modal-content > .authentication-modal-container > .form-container > .form > .btn"
//     ).click();
//     // ENDAUTH
//
//     // BUY TICKET
//     cy.get(
//       ".information-card-text > .button-container > .event-payment-button-container > div > .btn"
//     ).click();
//
//     cy.wait(5000);
//
//     cy.get("iframe").then(($iframe) => {
//       const doc = $iframe.contents();
//       cy.wrap(doc.find('input[name="cardnumber"]')).type("4000002500000003"); // fr
//       cy.wrap(doc.find('input[placeholder="MM / YY"]')).type("01").type("22");
//       cy.wrap(doc.find('input[placeholder="CVC"]')).type("123");
//     });
//
//     cy.get(
//       ".modal-content > .payment-modal-container > .payment-form-container > .button-container > .btn:nth-child(2)"
//     ).click();
//
//     cy.wait(5000);
//     cy.get('[role="dialog"]').click();
//     // END BUY TICKET
//
//     // JOIN EVENT
//     cy.get(
//       ".information-card-text > .button-container > .event-payment-button-container > a > .btn"
//     ).click();
//
//     cy.get(
//       ".page-container > .login-container > .form > .input-group > .input-block"
//     ).click();
//
//     cy.get(
//       ".page-container > .login-container > .form > .input-group > .input-block"
//     ).type("Smokey");
//
//     cy.get(
//       ".login-container > .form > .input-group > .profile-picture-upload-form > .profile-picture-button"
//     ).click();
//
//     // PICTURE UPLOAD
//     cy.fixture("images/favicon-32x32.png").then((fileContent) => {
//       cy.get(
//         ".login-container > .form > .input-group > .profile-picture-upload-form > #profile-picture-input"
//       ).attachFile({
//         fileContent: fileContent.toString(),
//         fileName: "testPicture.png",
//         mimeType: "image/png",
//       });
//     });
//     //  END PICTURE UPLOAD
//     // END JOIN EVENT
//
//     // VENUE QUESTION
//     cy.get("#root > .page-container > .login-container > .form > .btn").click();
//
//     cy.get('textarea[placeholder="Do you dance?"]').type("No");
//
//     cy.get("#root > .page-container > .login-container > .form > .btn").click();
//     // END VENUE QUESTION
//
//     // VENUE CODE OF CONDUCT
//     cy.get(
//       ".page-container > .login-container > .form > .input-group > .checkbox"
//     ).click();
//
//     cy.get(
//       ".page-container > .login-container > .form > .input-group > #contributeToExperience"
//     ); //.check("on");
//
//     cy.get('input[value="Enter the event"]').click();
//     // END VENUE CODE OF CONDUCT
//
//     cy.url().should("eq", "https://staging.sparkle.space/in/kansassmittys");
//
//     // JAZZBAR INTERACTIONS
//     // cy.get(
//     //   ".modal-dialog > .modal-content > .modal-body > .modal-container > .btn"
//     // ).click();
//
//     // cy.get(".video-wrapper > .row > .header > .action > #leave-seat").click();
//
//     // cy.get(
//     //   "div > .userlist-container > .row > .profile-picture-container:nth-child(2) > .profile-icon"
//     // ).click();
//
//     // cy.get(
//     //   ".private-chat-container > .chatbox-container > form > .chat-form > .chat-input"
//     // ).click();
//
//     // cy.get(".modal-open > .modal").click();
//   });
// });
