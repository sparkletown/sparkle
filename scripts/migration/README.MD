## Migration instructions:

- Create the backup of the database
- Create worlds from sovereign venues:
  - Run `scripts/migration/add-world-extend-venue-worldId.ts` script to create worlds & copy the relevant data from sovereign venue & assign the world id to the proper venues
- Setup Algolia full-text search:
  - Add [Algolia search](https://www.algolia.com/developers/firebase-search-extension/) firebase extension to your firebase project.
  - In the Firebase console point it to `users` collection and set indexable fields to `partyName,pictureUrl,anonMode,enteredVenueIds`.
  - Perform first-time import of the documents from `users` collection to Algolia index as described in the extension [docs](https://github.com/algolia/firestore-algolia-search/blob/main/POSTINSTALL.md#optional-import-existing-documents-or-reindex-after-configuration-changes).
  - Use Search API Key from [here](https://www.algolia.com/account/api-keys) and the line `REACT_APP_ALGOLIA_API_SEARCH_KEY=<search api key>` to your `.env.local`.
- Migrate venue chats structure:
  - Run `scripts/migration/migrate-venue-chats.ts`
