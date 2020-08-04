export interface Purchase {
  eventId: string;
  userId: string;
  // when the user opens the PaymentForm, the status is INITIALIZED
  // when the user clicks on Pay, the status is PROCESSING
  // when the result of the paymentIntent is "succeeded", the status is CONFIRMATION_FROM_STRIPE_PENDING
  // when we receive the confirmation from Stripe that the payment is a success, the status is COMPLETE
  // if an error occurs, the status becomes FAILED
  status:
    | "INITIALIZED"
    | "COMPLETE"
    | "CONFIRMATION_FROM_STRIPE_PENDING"
    | "PROCESSING"
    | "FAILED";
  venueId: string;
}
