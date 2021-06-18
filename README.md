# Sparkle Web App

Codebase for the Sparkle platform, brought to you by [Sparkle](https://sparklespaces.com/), a platform for the most immersive & interactive virtual events.

---

## Getting started

What you will need:

- A free Firebase account
- Your favorite command-line interface (e.g. Terminal or zsh on a Mac)
- Optional: accounts with Stripe, Twillio
- A little fairy dust

<!-- section 1 -->

## Part One: Firebase Project Setup

### Step 1: Create New Firebase Project

1. Go to https://console.firebase.google.com/u/2/

2. Click _Add project_
  * Fill out the name field with something like `example-project`
  * Click _Continue_


3. Optional: enable Google Analytics

  * Click _Continue_
  * Configure Google Analytics
  * Click _Create project_
  * Wait for project to be created
  * Click _Continue_

This part of the setup is complete!

<!-- section 2 -->

### Step 2: Configure Firebase Project Settings

1. Go to https://console.firebase.google.com/ and find the `Example Project` you chose in step 1.

2. From _Project Overview_, hover over the gear icon and click _Project Settings_

 * In the 'General' tab, set the public-facing name

 * In the 'Users & Permissions tab
(https://console.firebase.google.com/u/2/project/`example-project`/settings/iam)

    * Add any other users who will need "Owner" level access to this project (e.g. a backup owner who can change things if needed, deployments).

    * Add the users who will need "Editor" level access to this project.

~~3. TODO -- do we need to select the Blaze plan or can we run on free? Next, click the gear icon next to _Project Overview_ again, and then select Usage and billing_ (https://console.firebase.google.com/u/2/project/`example-project`/usage)~~

### Step 3: Add a New Web App to the Firebase Project

1. Click on _Project Overview_, then _Project Settings_ (https://console.firebase.google.com/u/2/project/`example-project`/settings/general)

2. In the 'General' tab:

 * Go to the 'Your Apps' section at the bottom.

 * Click on the `</>` button to create a new web app

 * Add firebase to your web app

 * Choose an app nickname (eg. `example-project`)

 * Tick 'Also set up Firebase Hosting for this app', leaving the dropdown that appears on the default setting

 * Click _Register app_

 * Wait for the _loading_ spinner to finish

  * Click _Next_ to skip past this screen

  * Click _Next_ to skip past this screen as well

  * Finally, you can click _Continue to the console_ to skip past this last screen

  **Necessary??:** internal deployments are handled automatically through our CircleCI workflow, so we don't need to deploy manually.

This part of the setup is now complete!

<!-- section 4 -->

### Step 4: Set up Firebase Hosting

1. From the Firebase console, within the appropriate project, click on 'Hosting' on the left hand menu (https://console.firebase.google.com/u/2/project/`example-project`/hosting)

2. Click on _Get started_

3. You can skip through these next screens by clicking _Next_.

4. Click _Continue to the console_

5. OPTIONAL Add a custom domain

 * In the hosting dashboard, click _Add custom domain_

 * Enter the details for the domain to use (eg. `example.sparkle.space`)

    **Note:** that you will also need to configure the DNS to make this work properly (see below), and this may take 24-48hrs to take effect

 * Don't check 'Redirect `example.sparkle.space` to an existing website'

 * Click _Continue_

 * If you haven't verified your domain before, you'll need to do this here. You will likely need to create a DNS 'TXT' record to prove that you own the domain, containing a `google-site-verification` value

 * You can follow similar steps to the ones described below to do this: _Enter domain --> Verify ownership --> Go live_

 * You will need to enter the following DNS 'A' records into your domain registrar (eg. GoDaddy) to point your domain at the Firebase servers

          (screenshot: record type, host, value)

    <details>
<summary>Example: Configure DNS records in GoDaddy</summary>
<ul>
<li>Be sure to write down your password</li>
<li>Go to the 'DNS Management' page
(https://dcc.godaddy.com/manage/sparkle.space/dns)</li>
<li>Scroll to the bottom until you find the 'Add' button</li>
<li>Click _Add_</li>
<li>In the 'Type' dropdown, select 'A'</li>
<li>In 'Host', enter the subdomain you configured in Firebase above (eg. `example`)</li>
<li>**Note:** only include the subdomain (eg. `example`) not the whole domain (eg. `example.sparkle.space`)</li>
<li>In 'Points to', enter the IP address from the Firebase custom domain configuration from above (eg. `151.101.1.195`)</li>
<li>Leave 'TTL' set to '1 Hour'</li>
<li>The settings should look something like this</li>
<li>Click _Save_</li>
<li>Repeat this process again to add the 2nd IP Address (eg. `151.101.65.195`) listed in the Firebase custom domain configuration from above</li>
<li>Once you have configured the DNS records at your domain registrar (eg. GoDaddy), you can click _Finish_ on the 'Add custom domain' modal</li>
<li>Back on the main hosting dashboard, you should see your custom domain listed, and if you hover over the 'status', should see something like this...</li>
  <li>If you click through to the domain, you might see a privacy error like this, which should go away after a little while once the TLS certificate's get provisioned/applied (which happens automatically)</li>
    <li>You can click on 'Advanced', then 'Proceed to example.sparkle.space' to get past this screen in the meantime</li>
    <li>You should now see the Firebase 'Site Not Found' page</li>
    <li>If so, then this part of the setup is complete!</li>
</ul>

You can close this page and return to the Firebase console.

</details>

<!-- section 5 -->

### Step 5: Set up Firebase Authentication

1. Go to the Firebase console, within the appropriate project.

2. Click on 'Authentication' on the left hand menu (https://console.firebase.google.com/u/2/project/`example-project`/authentication)

3. Click on _Get Started_

4. In the ‘Sign-in method’ tab

  * Hover over ‘Email/Password’, then click the edit icon (pencil)

  * Select ‘enabled’ (but leave email link ‘passwordless sign in’ disabled)

  * Click _Save_

  * Scroll down to 'Authorised domains'

  * Click _Add domain_

  * In the 'Domain' field, enter the custom domain we created above (eg. `example.sparkle.space`)

 * Click _Add_

 * Scroll down to 'Advanced'

 * Note that there is a 'Manage sign-up quota' setting, which defaults to `100` signups per hour from the same IP address. Under most normal cases, this probably doesn't need to be changed, but sometimes (eg. employees all accessing from the same office, therefore having the same IP address), you may need to temporarily increase this limit.

     * To do this, click _Change_

     * Configure 'Sign-ups per hour', 'Start Date', 'Time', and 'Duration (days)' as required

      **Note:** 'Sign-ups per hour' must be between `1` and `1000`, 'Start Date' must be in the future, 'Duration (days)' must be between `1` and `7`

    * Click _Save_

    * Notice the 'Sign-up quota change scheduled' notification

This part of the setup is complete!

<!-- section 6 -->

### Step 6: Additional Notes

**Note**: If you're interested in setting up the project to run in your own environment but you're not sure how to go about it, feel free to [open an issue](https://github.com/sparkletown/sparkle/issues/new) asking for assistance.

---

## Part Two: Setting Up the Sparkle Frontend

First, clone the repo and `cd` into it:

```bash
git clone https://github.com/sparkletown/sparkle
cd sparkle
```

In the main `sparkle` folder, copy `.env.example` to a new file `.env.local`, and fill it with the appropriate details, most of which you can find in the Firebase dashboard.

You can read more about the various `.env` files that you can use at: https://create-react-app.dev/docs/adding-custom-environment-variables#adding-development-environment-variables-in-env

Install the platform dependencies with `npm`:

(**Note:** `npm` v7+ is not supported, it will cause issues with our `package-lock.json`, and you may end up with the wrong dependency versions. Check your current npm version with `npm -v`.)

```bash
npm install
```

Now you're ready to start the server! ✨

```bash
npm start
```

Once the server is started, your web browser will be opened at http://localhost:3000 (and then it'll be immediately redirected to https://sparklespaces.com/). To start using the app, navigate to a URL such as http://localhost:3000/v/{venueName} - replacing `{venueName}` with the existing venue you'd like to use.

While you generally won't need to do this while developing locally, you can manually build the platform assets as follows:

```bash
npm run build
```

### Firebase functions

**Note:** Before you run the following steps, you will need to ensure you have access to the Firebase project you want to use. This access can be set up through the Firebase web UI.

**Note**: You might need to emulate the firebase functions locally before the server can properly start. If you have issues using/editing the actual staging functions, try that.

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

# Switch to the 'staging' project in our local configuration (or whichever environment you are developing against)
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

### Firebase emulators

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

## Our Git flow

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

Then, to deploy to `production`:

- (a Sparkle team member will) create a PR to **merge staging into `master`** with a name such as **`deploy staging -> master`**
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

## Deploying

Deploys are handled by CircleCI.

- Merging to `staging` will deploy to staging
- Merging to `master` will deploy to production
- Pushing the `master` branch to any of our other configured production branches will deploy to that environment

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
6. Be mindful this is PII (personally identifiable information) so handle it carefully and treat it as sensitive. It may be subject to the GDPR data privacy requirements in the EU and the CCPA privacy laws in California.
7. Share the Google sheet, ready to import the users into our other email lists.
8. Email the new folks, welcome them, and say thanks for coming to the party!

## Addenda

Sparkle is using Bugsnag! We are proud to be part of Bugsnag's open source program and are glad that Bugsnag supports open source.

[![Bugsnag Logo](https://avatars3.githubusercontent.com/u/1058895?s=200&v=4)](https://www.bugsnag.com)
