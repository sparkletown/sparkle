# Sparkle Web App

Codebase for Sparkle, brought to you by Sparkle.

## Getting started

You can get your first experience with Sparkle at staging: \
https://staging.sparkle.space/in/devaliashacksville

### Frontend

First, clone the repo and `cd` into it:

```bash
git clone https://github.com/sparkletown/sparkle
cd sparkle
```

In the main `sparkle` folder, copy `.env.example` to a new file `.env.local`, and fill it with the appropriate details.

You can read more about the various `.env` files that you can use at:

- https://create-react-app.dev/docs/adding-custom-environment-variables#adding-development-environment-variables-in-env

Install the platform dependencies with `npm`:

(**Note:** `npm` v7+ is not supported, it will cause issues with our `package-lock.json`, and you may end up with the wrong dependency versions)

```bash
npm install
```

Now you're ready to start the server! ✨

```bash
npm start
```

Once the server is started, you will have the browser opened at http://localhost:3000 (and then it'll be immediately redirected to https://sparklespaces.com/). To start surfing the app, you can use the following url http://localhost:3000/in/devaliashacksville.

**Note**: Frontend won't work without the backend. To finish your setup, go through Firebase configuration steps.

While you generally won't need to do this while developing locally, you can manually build the platform assets as follows:

```bash
npm run build
```

### Firebase functions

**Note:** Before you run the following steps, you will need to ensure you have access to the Firebase project you want to use. This access can be set up through the Firebase web UI.

In a new terminal, from the directory you cloned the code to, enter the following commands:

```bash
# While not necessary (as we already include it in our devDependencies), you can install the firebase-tools globally if desired
# npm install -g firebase-tools@latest

# Move into the firebase functions directory
cd functions

# Install the function dependencies
npm install

# Login to firebase with the account that has access to this project
firebase login

# Switch to the 'staging' project in our local configuration (or whichever environment you are developing against)
firebase use staging

# Copy the runtime config locally
firebase functions:config:get > .runtimeconfig.json
```

Now you're ready to launch the backend function emulator! ✨

```bash
# Run the command in the root app directory
npm run firebase:emulate-functions

# Or if you don't want to use our helper scripts, you can do this directly:
# firebase emulators:start --only functions
```

**Note**: You might need to emulate the firebase functions locally before the server can properly start. If you have issues using/editing the actual staging functions, try that.


### Stripe

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

## Git flow

To contribute to the code base, please follow these steps:

- create a branch from staging
- code
- create a pull request on staging

Then, to deploy to production, **merge staging into master**.

> When adding a quick fix to production:
>
> - create a branch from master
> - code
> - create a pull request on master
> - create a branch from staging
> - cherry-pick the commit
> - create a pull request on staging

## Deploying

Deploys are handled by CircleCI.

- Merging to staging will deploy to staging
- Merging to master will deploy to production

## Obtaining email addresses from firebase

WARNING: Only email people with consent. Permission based marketing is the best way to grow your email list.

```
$ firebase auth:export --project co-reality-map auth.json
$ jq '.users[] | "\(.createdAt) \(.email)"' auth.json|awk '$2!="null\"" {print $0}'|sed -e 's/^"//' -e 's/"$//'|awk '{print $1"\t"$2}'|pbcopy
```

Paste into a google sheet. Leftmost column is the [UNIX timestamp](https://en.wikipedia.org/wiki/Unix_time) of the account creation. This can be converted easily:

1. Create a new column to the right of the timestamp
2. Use the formula: `=A4/86400000 + DATE(1970,1,1)`
3. Fill down to get all values
4. Sort by timestamp or the calculated, human date
5. Consider not adding any with a "+"
6. Be mindful this is PII (personally identifiable information) so we should handle it carefully and treat it as sensitive. It may be subject to the GDPR data privacy requirements in the EU and the CCPA privacy laws in California.
7. Share the google sheet, ready to import the users into our other email lists.
8. Email the new folks, welcome them, and say thanks for coming to the party!

## Addenda

Sparkle is using Bugsnag! We are proud to be part of Bugsnag's open source program and are glad that Bugsnag supports open source.

[![Bugsnag Logo](https://avatars3.githubusercontent.com/u/1058895?s=200&v=4)](https://www.bugsnag.com)
