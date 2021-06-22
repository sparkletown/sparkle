# Sparkle Web App

Codebase for the Sparkle platform, brought to you by [Sparkle](https://sparklespaces.com/), a platform for the most immersive & interactive virtual events.


### Getting started

What you will need:

- A free Firebase account
- Your favorite command-line interface (e.g. Terminal or zsh on a Mac)
- Optional: accounts with Stripe, Twillio
- A little fairy dust

---
<!-- section 1 -->

## Part One: Firebase Project Setup

### Step 1: Create New Firebase Project

1. Go to https://console.firebase.google.com/u/2/.

2. Click _Add project_.
  * Fill out the name field with something like `example-project`
  * Click _Continue_


3. Optional: enable Google Analytics.

  * Click _Continue_
  * Configure Google Analytics
  * Click _Create project_
  * Wait for project to be created
  * Click _Continue_

This part of the setup is complete!


### Step 2: Configure Firebase Project Settings

1. Go to https://console.firebase.google.com/ and find the `Example Project` you chose in step 1.

2. From _Project Overview_, hover over the gear icon and click _Project Settings_.

 * In the 'General' tab:

    * Set the public-facing name.
   * In the ['Users & Permissions'](https://console.firebase.google.com/u/2/project/`example-project`/settings/iam) tab:

    * Add any other users who will need "Owner" level access to this project (e.g. a backup owner who can change things if needed, deployments).
    * Add the users who will need "Editor" level access to this project.

3. Optionally, upgrade your account. Click the gear icon next to _Project Overview_ again, and then select ['Usage and billing'](https://console.firebase.google.com/u/2/project/`example-project`/usage), then select the Blaze plan.

### Step 3: Add a New Web App to the Firebase Project

1. Click on _Project Overview_, then again on [_Project Settings_](https://console.firebase.google.com/u/2/project/`example-project`/settings/general).

 * In the 'General' tab:

    * Go to the 'Your Apps' section at the bottom.
    * Click on the `</>` button to create a new web app
    * Add firebase to your web app
    * Choose an app nickname (eg. `example-project`)
    * Tick 'Also set up Firebase Hosting for this app', leaving the dropdown that appears on the default setting
    * Click _Register app_
    * Wait for the _loading_ spinner to finish
    * Click _Next_ to skip past this screen
    * Click _Next_ to skip past this screen as well
    * Finally, you can click _Continue to the console_ to skip past this last screen; internal deployments are handled automatically through our CircleCI workflow, so we don't need to deploy manually

This part of the setup is now complete!


### Step 4: Set up Firebase Hosting

1. From the Firebase console, within the appropriate project, click on ['Hosting'](https://console.firebase.google.com/u/2/project/`example-project`/hosting) on the left hand menu.

2. Click on _Get started_.

 * You can skip through these next screens by clicking _Next_
  * Click _Continue to the console_

2. OPTIONAL Add a custom domain.

 * In the hosting dashboard, click _Add custom domain_
 * Enter the details for the domain to use (eg. `example.sparkle.space`)
    **Note:** you will also need to configure the DNS to make this work properly (see below), and this may take 24-48hrs to take effect
 * Don't check 'Redirect `example.sparkle.space` to an existing website'
 * Click _Continue_
 * If you haven't verified your domain before, you'll need to do this here. You will likely need to create a DNS 'TXT' record to prove that you own the domain, containing a `google-site-verification` value
 * You can follow similar steps to the ones described below to do this: _Enter domain --> Verify ownership --> Go live_
 * You will need to enter the provided DNS 'A' records into your domain registrar (eg. GoDaddy) to point your domain at the Firebase servers (record type, host, value)

You can close this page and return to the Firebase console.

</details>


### Step 5: Set up Firebase Authentication

1. From the Firebase console, within the appropriate project, click on ['Authentication'](https://console.firebase.google.com/u/2/project/`example-project`/authentication) on the left hand menu.

2. Click on _Get Started_.

  * In the ‘Sign-in method’ tab:

    * Hover over ‘Email/Password’, then click the edit icon (pencil)
    * Select ‘enabled’ (but leave email link ‘passwordless sign in’ disabled)
    * Click _Save_
    * Scroll down to 'Authorised domains'
    * Click _Add domain_
    * In the 'Domain' field, enter the custom domain we created above (eg. `example.sparkle.space`)
    * Click _Add_
    * Scroll down to 'Advanced'


  3. _Note that there is a 'Manage sign-up quota' setting, which defaults to `100` signups per hour from the same IP address. Under most normal cases, this probably doesn't need to be changed, but sometimes (eg. employees all accessing from the same office, therefore having the same IP address), you may need to temporarily increase this limit._

    * To do this, click _Change_
        * Configure 'Sign-ups per hour', 'Start Date', 'Time', and 'Duration (days)' as required
         * 'Sign-ups per hour' must be between `1` and `1000`
         * 'Start Date' must be in the future
         * 'Duration (days)' must be between `1` and `7`
    * Click _Save_
    * Notice the 'Sign-up quota change scheduled' notification

This part of the setup is complete!


### Step 6: Additional Notes

If you're interested in setting up the project to run in your own environment but you're not sure how to go about it, feel free to [open an issue](https://github.com/sparkletown/sparkle/issues/new) asking for assistance.

---
<!-- section 2 -->

## Part Two: Set Up Your Local Environment

### Step 1: Clone the Sparkle Repository

First, clone the repo and `cd` into it:

```bash
git clone https://github.com/sparkletown/sparkle
cd sparkle
```

### Step 2: Install Packages

Install the platform dependencies with `npm`:

**Important Note:** `npm` v7+ is not supported, it will cause issues with our `package-lock.json`, and you may end up with the wrong dependency versions. Check your current npm version with `npm -v`.

```bash
npm install
```

### Step 3: Connect with Firebase

In the main `sparkle` folder, copy `.env.example` to a new file `.env.local`, and fill it with the appropriate details, most of which you can find in the Firebase dashboard.

You can read more about the various `.env` files that you can use at: https://create-react-app.dev/docs/adding-custom-environment-variables#adding-development-environment-variables-in-env


### Step 4: Start Your Engines

Now you're ready to start the server! ✨

```bash
npm start
```

Once the server is started, your web browser will be opened at http://localhost:3000 (and then it'll be immediately redirected to https://sparklespaces.com/).

To start using the app, you must have a venue setup. Venue URLs take the form of http://localhost:3000/v/{venueName} - replacing `{venueName}` with the existing venue you'd like to use.

If this is your first time running Sparkle and you are using a fresh Firebase, we have simplified the initial venue setup and admin access using scripts found in the **/scripts/** directory.

While you generally won't need to do this while developing locally, you can manually build the platform assets as follows:

```bash
npm run build
```

**Note**: You might need to emulate the firebase functions locally before the server can properly start. If you have issues using/editing the actual staging functions, try that.


### Step 5: Configure Firebase Functions

Before you run the following steps, you will need to ensure you have access to the Firebase project you want to use. This access can be set up through the Firebase web UI.

In a new terminal, from the directory you cloned the code to, enter the following commands:

```bash
# While not necessary (as we already include it in our devDependencies), you can install the firebase-tools globally if desired
# npm install -g firebase-tools@latest

# Move into the firebase functions directory
cd functions

# Install the function dependencies
npm install

# Go back to the root app directory to use firebase package
cd ..

# Login to firebase with the account that has access to this project
npm run firebase login

# If you are contributing to the Sparkle main code base, switch to the 'staging' project, otherwise switch to 'example-project' or whichever environment you are developing against
npm run firebase use staging

# Copy the runtime config locally
npm run --silent firebase functions:config:get > ./functions/.runtimeconfig.json
```

Now you're ready to launch the backend function emulator! ✨

```bash
# Run the command in the root app directory
npm run firebase:emulate-functions

# Or if you don't want to use our helper scripts, you can do this directly:
# npm run firebase emulators:start --only functions
```

### Step 6: Firebase Emulators

Instead of running just the functions' emulator, the full suite of emulators can be used.
You can find out more at https://firebase.google.com/docs/emulator-suite.

**Note**: If your code accidentally invokes non-emulated (production) resources, there is a chance of data change, usage and billing.
To prevent this, you might opt in to use a Firebase project name beginning with `demo-` (e.g. `demo-staging`) in which case no production resources will be used.

First though, a **major version of 8** for the Firebase client is required:
```bash
npm i firebase@8
```
This might entail some code changes as well, to enable the emulation, e.g.
```javascript
// Enable the functions emulator when running in development at specific port
if (process.env.NODE_ENV === "development" && window.location.port === "5000") {
  firebaseApp.firestore().useEmulator("localhost", 8080);
}
```
or to account for changed and/or deprecated Firebase client API, e.g.
```javascript
// deprecated
// import firebase, { UserInfo } from "firebase/app";
// use instead
import firebase from "firebase/app";
type UserInfo = firebase.UserInfo;
```

You can start the emulators in a manner that can persist the data locally:
```bash
npx --no-install -- firebase "emulators:start" --import=./tmp --export-on-exit
```

You should be greeted with
```bash
All emulators ready! View status and logs at http://localhost:4000
```
That's the location you can access and manage the running emulators.
The data between emulator runs should be persisted at
```bash
tmp/firebase-export-metadata.json
tmp/firestore_export
```

---
<!-- section 3 -->

## Part Three: Configure Third-Party Integrations

### Optional: Twilio

TODO: Add steps.


### Optional: Stripe

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


---
<!-- section 4 -->

## Part Four: Contribute to Sparkle

### Our Git Flow

If you're new to Git / GitHub flows, then you may find these guides helpful:

- https://guides.github.com/introduction/git-handbook/
- https://guides.github.com/activities/forking/
- https://guides.github.com/introduction/flow/

To contribute to the code base, please follow these steps:

- fork the repository (note: Sparkle team skip this step)
- create a new branch from `staging`
- write your code
- create a pull request to merge your branch into `staging`
- wait for code review
- fix any review comments
- once the review has been finalised, a team member will **squash-merge** the PR into `staging`, which will trigger the CI to deploy the `staging` environment

Then, to deploy to `production`, a Sparkle team member will:

- create a PR to **merge staging into `master`** with a name such as **`deploy staging -> master`**
- add the `🚀 deployment` label
- copy the commit messages (including the `#1234` PR they were made in) and paste it into the PR description after `Deploys:` (see [example](https://github.com/sparkletown/sparkle/pull/1355))
- **merge (not squash-merge)** this 'deployment PR' into `master`, this will trigger the CI system to deploy to the '[OG](https://www.dictionary.com/e/slang/og/) `production`' environment
- push the `master` branch to any other environment branches (eg. `env/foo`) to trigger the CI system to deploy those environments as well

> When adding a quick fix to production:
>
> - create a branch from master
> - code
> - create a pull request on master
> - create a branch from staging
> - cherry-pick the commit
> - create a pull request on staging

### Deploying

Deploys are handled by CircleCI.

- Merging to `staging` will deploy to staging
- Merging to `master` will deploy to production
- Pushing the `master` branch to any of our other configured production branches will deploy to that environment

---
<!-- section 5 -->

## Part Five: Addenda

Sparkle is using Bugsnag! We are proud to be part of Bugsnag's open source program and are glad that Bugsnag supports open source.

[![Bugsnag Logo](https://avatars3.githubusercontent.com/u/1058895?s=200&v=4)](https://www.bugsnag.com)
