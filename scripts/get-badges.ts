#!/usr/bin/env node -r esm -r ts-node/register

import admin from "firebase-admin";
import { chunk } from "lodash";

import { User } from "../src/types/User";
import { WithId, withId } from "../src/utils/id";

import { initFirebaseAdminApp } from "./lib/helpers";

const usage = () => {
  const scriptName = process.argv[1];
  const helpText = `
---------------------------------------------------------
${scriptName}: Get user details. Prints each user's email address, last seen time in milliseconds since epoch, and codes used.

Usage: ${scriptName} PROJECT_ID VENUE_IDS

Example: ${scriptName} co-reality-map venueId,venueId2,venueIdN
---------------------------------------------------------
`;

  console.log(helpText);
  process.exit(1);
};

const [projectId, venueIds] = process.argv.slice(2);
if (!projectId || !venueIds) {
  usage();
}

const venueIdsArray = venueIds.split(",");

initFirebaseAdminApp(projectId);

(async () => {
  // TODO: extract this as a generic helper function?
  const usersWhoEnteredAnyOfVenues: WithId<User>[] = await admin
    .firestore()
    .collection("users")
    .where("enteredVenueIds", "array-contains-any", venueIdsArray)
    .get()
    .then((snapshot) =>
      snapshot.docs.map((doc) => withId(doc.data() as User, doc.id))
    );

  // TODO: extract this as a generic helper function?
  // Note: 100 is the max that can be requested with getUsers() per chunk
  const authUsers: admin.auth.UserRecord[] = await Promise.all(
    chunk(usersWhoEnteredAnyOfVenues, 100).map(async (usersChunk) => {
      const usersChunkIds = usersChunk.map((user) => ({ uid: user.id }));
      const authUsersResult = await admin.auth().getUsers(usersChunkIds);

      return authUsersResult.users;
    })
  ).then((result) => result.flat());

  const authUsersById = authUsers.reduce(
    (acc, authUser) => ({ ...acc, [authUser.uid]: authUser }),
    {} as Record<string, admin.auth.UserRecord>
  );

  // TODO: filter enteredVenueIds so that they only contain related venues?

  const result = usersWhoEnteredAnyOfVenues.map((user) => {
    const { id, partyName, enteredVenueIds = [] } = user;
    const { email } = authUsersById[id];

    return {
      id,
      email,
      partyName,
      enteredVenueIds: enteredVenueIds.sort(),
    };
  });

  // Display CSV headings
  console.log(
    ["Email", "Party Name", "Entered Venues"]
      .map((heading) => `"${heading}"`)
      .join(",")
  );

  // Display CSV lines
  result.forEach((user) => {
    const csvLine = [user.email, user.partyName, user.enteredVenueIds]
      .map((s) => `"${s}"`)
      .join(",");

    console.log(csvLine);
  });

  process.exit(0);
})();
