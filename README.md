# Sparkle Web App

Codebase for Sparkle, brought to you by Sparkle.

## Getting started

### Frontend

Clone the repo and cd into it

```
git clone https://github.com/sparkletown/sparkle
cd sparkle
```

Now, obtain the `.env` file for the environemnt (eg. staging) and save it (eg. `.env.staging`)

```
# copy in the .env files
# symlink the staging .env file
ln -s .env.staging.local .env
```

Now you're ready to start the server

```
npm i
npm test
npm start
```

You won't need to in dev, but you can also test builds:

```
npm run build
```

### Firebase functions

```bash
npm install -g firebase-tools@latest

cd functions
npm install
firebase login
firebase use staging
firebase functions:config:get
```

Copy the output of this command and paste it in `functions/.runtimeconfig.json`. Then, launch the server with:

```bash
firebase emulators:start --only functions
```

### Stripe

Note: Stripe is NOT REQUIRED unless you will be testing ticketing integration.

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

![Bugsnag Logo](https://avatars3.githubusercontent.com/u/1058895?s=200&v=4)
