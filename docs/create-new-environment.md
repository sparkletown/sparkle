# Sparkle Web App

Codebase for the Sparkle platform, brought to you by [Sparkle](https://sparklespaces.com/), a platform for the most immersive & interactive virtual events.

### Firebase Project Setup

<!-- section 1 -->

### Step 1: Create New Firebase Project

1. Go to https://console.firebase.google.com.

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
   * In the ['Users & Permissions'] tab:

    * Add any other users who will need "Owner" level access to this project (e.g. a backup owner who can change things if needed, deployments).
    * Add the users who will need "Editor" level access to this project.

3. Upgrade your account to Blaze plan. Click the gear icon next to _Project Overview_ again, and then select ['Usage and billing'], then select the Blaze plan.

### Step 3: Add a New Web App to the Firebase Project

1. Click on _Project Overview_, then again on [_Project Settings_].

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

1. From the Firebase console, within the appropriate project, click on ['Hosting'] on the left hand menu.

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

1. From the Firebase console, within the appropriate project, click on ['Authentication'] on the left hand menu.

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

Now you can proceed to bootstrapping your application ./bootstrap-application.md


### Step 6: Additional Notes

If you're interested in setting up the project to run in your own environment but you're not sure how to go about it, feel free to [open an issue](https://github.com/sparkletown/sparkle/issues/new) asking for assistance.

---
