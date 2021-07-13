# Connect your application to Firebase

## 'Bootstrap' the platform

Make sure that you're located in ./scripts folder.

In order to complete following steps you'd need to log in your Firebase account via CLI.


```
# Note that if you were already logged in via Firebase CLI you'd first need to run:
npx firebase logout

# Login to firebase with the account that has access to this project. You'll be prompted to log in via Google OAuth.
npx firebase login

# Find the ID of the project that you'd like to use from the output of the command below:
npx firebase projects:list

# Switch to 'example-project' or whichever environment you are developing against
npx firebase use TODO-PROJECT-ID
```

Now you're ready to proceed.

First of all, you need to boostrap an environment using the following command:

* Run the bootstrap script

```
./bootstrap-new-environment.ts TODO-PROJECT-ID example-project-firebase-adminsdk-XXXXX-XXXXXXXXXX.json
```

As a result you should be able to see the 'Bootstraping complete' message:

```
Creating 'bootstrap' venue...
Done

Bootstrapping complete!
```

Then we'll be able to add a user (or few) to your application:

```
./create-users.ts example-project-firebase-adminsdk-XXXXX-XXXXXXXXXX.json user1@example.com user2@example.com

User created: email=user1@example.com, password=REDACTED
User created: email=user2@example.com, password=REDACTED
```

Once complete you should be able to make that user an admin by running:

```
./update-admin-role-users.ts example-project-firebase-adminsdk-XXXXX-XXXXXXXXXX.json ADD user1@example.com user2@example.com

User created: email=user1@example.com, password=REDACTED
User created: email=user2@example.com, password=REDACTED
```

As a result you'll see this message:

```
User successfully added to ( or already existed in ) 'admin' role
```

## Update Firestore rules


Please run the following command:

```
npx firebase deploy --only firestore:rules
```

It should finish with a message saying:

```
Deploy started.

...

Deploy Completed!
```

## Configure ENV file

In order for your application to connect to the proper Firebase environment you'll need to set up `.env.local` config. Please follow steps below:

* Locate or create `.env.local` file inside project root folder
* Paste the following config

```
REACT_APP_PROJECT_ID=
REACT_APP_API_KEY=
REACT_APP_APP_ID=
REACT_APP_MEASUREMENT_ID=
REACT_APP_BUCKET_URL=
```

You can find all of these values in the Firebase - _Project Settings_ - _General_ tab.

Once you've populated the ENV file with correct data, please proceed to the next part where you will be able to launch your project.

Proceed to [Getting Started](getting-started.md) to launch your application.
