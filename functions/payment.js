const firebase = require("firebase");
const admin = require("firebase-admin");
const functions = require("firebase-functions");

const secrets = require("./secrets");

// Set your secret key. Remember to switch to your live secret key in production!
// See your keys here: https://dashboard.stripe.com/account/apikeys
const stripe = require("stripe")(secrets.STRIPE_SECRET_KEY);

exports.createPaymentIntent = functions.https.onCall(async (data, context) => {
  if (!context.auth || !context.auth.token) {
    throw new functions.https.HttpsError("unauthenticated", "Please log in");
  }

  if (context.auth.token.aud !== secrets.PROJECT_ID) {
    throw new functions.https.HttpsError("permission-denied", "Token invalid");
  }

  if (
    !(data && data.venueId && data.eventId && data.userEmail && data.userId)
  ) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "venue, event or return url data missing"
    );
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: data.price,
    currency: "gbp",
    metadata: { integration_check: "accept_a_payment" },
    receipt_email: data.userEmail,
  });

  await firebase.firestore().collection("purchases").doc(paymentIntent.id).set({
    venueId: data.venueId,
    eventId: data.eventId,
    userId: data.userId,
    status: "PENDING",
  });

  return { client_secret: paymentIntent.client_secret };
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
  if (event.type === "charge.succeeded") {
    const charge = event.data.object;

    // Fulfill the purchase...
    await firebase
      .firestore()
      .collection("purchases")
      .doc(charge.payment_intent)
      .update({
        status: "COMPLETE",
      });
  }

  // Return a response to acknowledge receipt of the event
  return res.status(200).send({ received: true });
});
