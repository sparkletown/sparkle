## Getting started

### First time setup

If you don't have a working Firebase environment please follow the guide below:

[Firebase setup](create-new-environment.md)

In case you didn't connect your application to the Firebase environment, then this guide should help:

[Bootstrap application](bootstrap-application.md)

Otherwise, if you've got through these steps, please follow the guide below to successfully tart your application.

### Launch application

You're going to need 2 terminal tabs to launch Sparkle application locally. Make sure that you're located in the application root folder and follow steps below:

* Run `npm run firebase:emulate-functions` in the first tab
* Run `npm run start` in the second

Once the launch is complete you may proceed to http://localhost:3000/v/bootstrap

You can register a new user by pressing _Log In_ in the top right corner:

Once redirected to authorization form select _Create account_:

* Fill in necessary data and press _Continue_
* Fill in your Username and upload custom avatar, or select from the default ones. Then press _Create my profile_:

Navigate to http://localhost:3000/v/bootstrap where you can enter your first venue.

Now you may also visit Admin dashboard to edit venues, create new ones or manage users.

* http://localhost:3000/admin
* http://localhost:3000/admin-ng
