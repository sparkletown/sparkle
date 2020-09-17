# Sparkle: SparkleTown Platform

Codebase for SparkleTown, brought to you by Sparkle.

## Getting started

### Frontend

```
git clone ...
cd co-reality-map
npm i
npm run init # Initialize secrets files with default values
npm test
npm start
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

First, you need to install the [Stripe CLI](https://stripe.com/docs/stripe-cli). Make sure that you have a Stripe account with the right credentials. Contact [chris@cadams.com.au](mailto:chris@cadams.com.au) if you don't.

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

Then, to deploy functionalities to production, **merge staging into master**.

> When adding a quick fix to production:
>
> - create a branch from master
> - code
> - create a pull request on master
> - create a branch from staging
> - cherry-pick the commit
> - create a pull request on staging

## Deploying

tl;dr:

```
npm i -g firebase-tools # only need this once
firebase login # only need this once
npm run build && firebase deploy
```

You can do a faster deploy by deploying just hosting:

```
npm run build && firebase deploy --only hosting
```

**NOTE:** You may get a warning about deleting the function `checkAdminPassword`; this is a function from [co-reality-admin](https://github.com/co-reality/co-reality-admin) and will be folded into this repo in future. In the meantime please don't delete this function.

## Uploading config for an event

`src/config.js` has the ID of the Firestore document containing the party configuration. For example, if it's "co-reality-5", the Firestore document with the party config is IDed by `config/co-reality-5`.

To upload a new config, use `scripts/upload.sh`:

```
$ scripts/upload.sh co-reality-5 user@name.com password
```

This will upload the JSON object exported from `configs/co-reality-5.js` to the Firestore document `config/co-reality-5`.

Watching for changes:

```
$ brew install fswatch
$ VENUE=co-reality-5; fswatch -o configs/${VENUE}.js | xargs -n1 -I{} ./scripts/upload.sh ${VENUE} user@name.com password
```

## Automatic upload of map changes

You can use a quick shell script while editing the map, to speed up the process of seeing your changes on the map:

- Edit `scripts/config-upload.js` to replace the code that prompts for username and password, with the username and password you would type:

```
read(username)
read(password)
```

becomes:

```
//read(username)
//read(password)
const username = 'email@address.com`
const password = 'password'
```

- Run the automatic upload script:

```
$ CONFIG=co-reality-6; fswatch -o configs/${CONFIG}.js| xargs -n1 -I{} ./scripts/upload.sh ${CONFIG}
```

- Be careful not to commit or push your script change, since it contains your password!

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
