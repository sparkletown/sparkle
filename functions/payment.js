const firebase = require("firebase");
const admin = require("firebase-admin");
const functions = require("firebase-functions");

const secrets = require("./secrets");

// Set your secret key. Remember to switch to your live secret key in production!
// See your keys here: https://dashboard.stripe.com/account/apikeys
const stripe = require("stripe")(secrets.STRIPE_SECRET_KEY);

exports.getSessionId = functions.https.onCall(async (data, context) => {
  // Validation checks
  if (!context.auth || !context.auth.token) {
    throw new functions.https.HttpsError("unauthenticated", "Please log in");
  }

  if (context.auth.token.aud !== secrets.PROJECT_ID) {
    throw new functions.https.HttpsError("permission-denied", "Token invalid");
  }

  if (!(data && data.venueId && data.eventId && data.returnUrl)) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "venue, event or return url data missing"
    );
  }

  const getVenue = async () => {
    const venueDoc = await firebase
      .firestore()
      .doc(`venues/${data.venueId}`)
      .get();

    return venueDoc.data();
  };
  const venue = await getVenue();

  const getEvent = async () => {
    return (
      await firebase
        .firestore()
        .doc(`venues/${data.venueId}/events/${data.eventId}`)
        .get()
    ).data();
  };
  const event = await getEvent();

  // @TODO: Check if venue and event entries exist
  // @TODO: Check if purchase entry exist

  // Do Stripe stuff
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "gbp",
          product_data: {
            name: `Ticket to ${event.name}@${venue.name}`,
          },
          unit_amount: event.price,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${data.returnUrl}?session_id={CHECKOUT_SESSION_ID}&redirectTo=payment_success`,
    cancel_url: data.returnUrl,
  });

  // Create purchase item
  // await firebase.firestore().collection("purchases").doc(`${data.venueId}-${data.eventId}-${context.auth.uid}`).set({
  await firebase.firestore().collection("purchases").doc(session.id).set({
    venueId: data.venueId,
    eventId: data.eventId,
    userId: context.auth.uid,
    status: "PENDING",
  });

  return { session_id: session.id };
});

const endpointSecret = secrets.STRIPE_ENDPOINT_KEY;

exports.webhooks = functions.https.onRequest(async (request, res) => {
  const sig = request.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      request.rawBody,
      sig,
      endpointSecret
    );
  } catch (err) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      `Webhook Error: ${err.message}`
    );
  }

  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    console.log(session);

    // Fulfill the purchase...
    await firebase.firestore().collection("purchases").doc(session.id).update({
      status: "COMPLETE",
    });
  }

  // Return a response to acknowledge receipt of the event
  return res.status(200).send({ received: true });
});
