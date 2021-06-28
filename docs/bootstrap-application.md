### Connect your application to Firebase

<!-- section 1 -->
## 'Bootstrap' the platform

Make sure that you're located in ./scripts folder.

First of all you'd need to boostrap an environment using the following command:

* Run the bootstrap script `./bootstrap-new-environment.ts TODO-PROJECT-ID [PRIVATE-KEY-FILE].json`

As a result you should be able to see the 'Bootstraping complete' message
<!--<!-- ![image](./images/creating-new-environments/57-bootstrap-complete.png) --> -->

Then we'll be able to add a user to your application:

```
⇒ ./create-users.ts [PRIVATE-KEY-FILE].json user@sparkle.space

User created: email=user@sparkle.space, password=REDACTED

```

We seem to need to manually create the `roles` collection in firestore, with a single `admin` document, that contains the following fields:

* `allowAll` (boolean): `false`
* `users` (array of strings): either an empty array (`[]`), or adding the user uid's copied from Firebase Authentication for the users who need to be admins.

**Note:** you also need to be added to the `owners` field on a venue to be able to edit it. The `roles` collection just controls whether you're able to access the admin panel at all.

<!-- ![image](./images/creating-new-environments/53-roles-collection.png) -->

Once complete you should be able to make that user an admin. To do so run this command:
* `./update-admin-role-users.ts [PRIVATE-KEY-FILE].json ADD user@sparkle.space`

As a result you'll see this message:
<!-- ![image](./images/creating-new-environments/58-user-admin-role.png) -->

<!-- section 2 -->

## Configure ENV file

In order for your application to connect to the proper Firebase environment you'd need to set up .env.local config. Please follow steps below:

* Locate or create .env.local file inside project root folder
* Paste the following config
`
REACT_APP_PROJECT_ID=
REACT_APP_API_KEY=
REACT_APP_APP_ID=
REACT_APP_MEASUREMENT_ID=
REACT_APP_BUCKET_URL=
`

Here's a list of places where you can find the config values:
* REACT_APP_PROJECT_ID, REACT_APP_APP_ID and REACT_APP_API_KEY can be found in Firebase - Project Settings - General tab
* REACT_APP_MEASUREMENT_ID can be found at https://analytics.google.com/analytics/web. You can search for Measurement ID in the search bar at the top of the page
* REACT_APP_BUCKET_URL con ofsists REACT_APP_PROJECT_ID and equals REACT_APP_PROJECT_ID.appspot.com

Once you've populated ENV file with correct data, please proceed to the next step.

<!-- section 3 -->

## Deploy local Firestore rules

* Please run `npx firebase deploy --only firestore:rules`
It should finish with this message:
<!-- ![image](./images/creating-new-environments/58-rules-deploy.png) -->

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

# Finally, we need to perform the first deploy to the functions manually, to make sure all of the required cloud API's get enabled/etc, then after that, CI should be able to do it for us going forward:

npm run firebase --project TODO-PROJECT-ID deploy --only functions

# You may need to run this a couple of times, as it seems to cause various Google cloud APIs to get enabled/etc, which sometimes fail/time out. As a result you should see Deploy complete! message

Proceed to ./getting-started.md to launch your application.
