## Configuring search:

Before the code merge, please, ensure you have the following
[environment variables in CircleCI](https://app.circleci.com/settings/project/github/sparkletown/sparkle/environment-variables?return-to=https%3A%2F%2Fapp.circleci.com%2Fpipelines%2Fgithub%2Fsparkletown%2Fsparkle)
(replacing `REACT_APP_` with the prefix of the environment - the prefixes can be
found in the [config.yml](../../.circleci/config.yml)):

- `REACT_APP_AUTH_DOMAIN` - _enables SSO_ - the value of the variable can be
  found in the in the Firebase project -> `Authentication` item of the left-side
  menu -> `Sign-in method` tab -> Authorised domain (for example,
  `co-reality-staging.firebaseapp.com`)
- `REACT_APP_MIXPANEL_PROJECT_TOKEN` - _enables tracking events for
  statistics_ - you should have access to the mixpanel Sparkle account -> choose
  the project (for example, `Sparkle - Staging`) -> Gear Icon ⚙️ in the navbar
  menu -> `Project Settings` -> `Project Token`
- `REACT_APP_ALGOLIA_API_SEARCH_KEY=<search api key>` - _enables search
  engine_ - use Search API Key from
  [here](https://www.algolia.com/account/api-keys)
- `REACT_APP_ALGOLIA_APP_ID` - _enables search engine_ - use Application ID from
  [here](https://www.algolia.com/account/api-keys)

Actions to take:

- Make user location updates work
  - Go to scheduled functions https://console.cloud.google.com/cloudscheduler
  - Choose proper org and project
  - View logs of firebase-schedule-scheduled-updateUsersLocations
  - Find the last failed execution of the above function
  - The error will contain a link to create an index
  - Click it and create an index
- Create the backup of the database
  - Go to https://console.cloud.google.com/firestore/import-export
  - Choose the proper organization/project
  - Click `Export`
  - Click `Export entire database`
  - Choose `sparkle_data_backups` bucket
- Setup Algolia full-text search:
  - Add
    [Algolia search](https://www.algolia.com/developers/firebase-search-extension/)
    firebase extension to your firebase project.
  - In the Firebase console point it to `users` collection and set indexable
    fields to `partyName,pictureUrl,anonMode,enteredVenueIds`.
  - Create a separate org and index create a new index in aloglia. Go through
    the required steps as they suggest
  - in Algolia set the attributes for faceting to `enteredVenueIds` and set its
    state to filter-only
  - Perform first-time import of the documents from `users` collection to
    Algolia index as described in the extension
    [docs](https://github.com/algolia/firestore-algolia-search/blob/main/POSTINSTALL.md#optional-import-existing-documents-or-reindex-after-configuration-changes).
