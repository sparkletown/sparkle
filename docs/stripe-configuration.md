### Stripe configuration

**Note**: Stripe is NOT REQUIRED unless you will be testing ticketing integration.

First, you need to install the [Stripe CLI](https://stripe.com/docs/stripe-cli). Make sure that you have a Stripe account with the right credentials.

```bash
brew install stripe/stripe-cli/stripe
stripe login
stripe listen --forward-to http://localhost:5001/co-reality-staging/us-central1/payment-webhooks
```

You should see

```
> Ready! Your webhook signing secret is {YOUR_LOCAL_SIGNING_SECRET_KEY} (^C to quit)
```

Copy this value and add it to the file `functions/secrets.js`.

```js
// functions/secrets.js
...
const STRIPE_ENDPOINT_KEY = `${YOUR_LOCAL_SIGNING_SECRET_KEY}`;
```
