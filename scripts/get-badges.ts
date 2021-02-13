#!/usr/bin/env node -r esm -r ts-node/register

import { resolve } from "path";

import admin from "firebase-admin";
import { chunk } from "lodash";

import { UserVisit } from "../src/types/Firestore";
import { User } from "../src/types/User";

import { WithId, withId } from "../src/utils/id";

import { initFirebaseAdminApp, makeScriptUsage } from "./lib/helpers";

const usage = makeScriptUsage({
  description:
    "Retrieve 'badge' details (in CSV format) of users who entered the specified venue(s), and how long they spent in each. Note due to database schema this script accepts venue NAMES, NOT venue IDs.",
  usageParams: "PROJECT_ID VENUE_NAMES [CREDENTIAL_PATH]",
  exampleParams:
    'co-reality-map "venue Name 1,venue Name 2,venue Name 3" [theMatchingAccountServiceKey.json]',
});

const [projectId, venueIds, credentialPath] = process.argv.slice(2);

// Note: no need to check credentialPath here as initFirebaseAdmin defaults it when undefined
if (!projectId || !venueIds) {
  usage();
}

const venueIdsArray = venueIds
  .split(",")
  .map((venueId) => venueId.toLocaleLowerCase()); // Case insensitive venue NAME comparison (not venueId)

initFirebaseAdminApp(projectId, {
  credentialPath: credentialPath
    ? resolve(__dirname, credentialPath)
    : undefined,
});

interface UsersWithVisitsResult {
  user: WithId<User>;
  visits: WithId<UserVisit>[];
}

(async () => {
  // TODO: extract this as a generic helper function?
  const usersWithVisits: UsersWithVisitsResult[] = await Promise.all(
    await admin
      .firestore()
      .collection("users")
      .get()
      .then((usersSnapshot) =>
        usersSnapshot.docs.map(async (userDoc) => {
          const user = withId(userDoc.data() as User, userDoc.id);

          const visits = await userDoc.ref
            .collection("visits")
            .get()
            .then((visitsSnapshot) =>
              visitsSnapshot.docs.map((visitDoc) =>
                withId(visitDoc.data() as UserVisit, visitDoc.id)
              )
            );

          return { user, visits };
        })
      )
  );

  // TODO: extract this as a generic helper function?
  // Note: 100 is the max that can be requested with getUsers() per chunk
  const authUsers: admin.auth.UserRecord[] = await Promise.all(
    chunk(usersWithVisits, 100).map(async (usersWithVisitsChunk) => {
      const chunkUserIds = usersWithVisitsChunk.map((userWithVisits) => ({
        uid: userWithVisits.user.id,
      }));

      const authUsersResult = await admin.auth().getUsers(chunkUserIds);

      return authUsersResult.users;
    })
  ).then((result) => result.flat());

  const authUsersById: Record<
    string,
    admin.auth.UserRecord | undefined
  > = authUsers.reduce(
    (acc, authUser) => ({ ...acc, [authUser.uid]: authUser }),
    {}
  );

  // TODO: filter enteredVenueIds and visitsTimeSpent so that they only contain related venues?
  const result = usersWithVisits
    .filter((userWithVisits) => {
      return userWithVisits.visits.find((visit) =>
        venueIdsArray.includes(visit.id.toLocaleLowerCase())
      );
    })
    .flatMap((userWithVisits) => {
      const { user, visits } = userWithVisits;
      const { id, partyName } = user;
      const { email } = authUsersById[id] ?? {};

      return visits.map((visit) => ({
        id,
        email,
        partyName,
        venueName: visit.id,
        timeSpent: visit.timeSpent,
      }));
    });

  // Display CSV headings
  console.log(
    ["Email", "Party Name", "Venue Visited", "Time Spent"]
      .map((heading) => `"${heading}"`)
      .join(",")
  );

  // Display CSV lines
  result.forEach((visit) => {
    const csvLine = [
      visit.email,
      visit.partyName,
      visit.venueName,
      visit.timeSpent,
    ]
      .map((s) => `"${s}"`)
      .join(",");

    console.log(csvLine);
  });
})()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
