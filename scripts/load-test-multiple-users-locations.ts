#!/usr/bin/env node -r esm -r ts-node/register
// noinspection ES6PreferShortImport

import { resolve } from "path";

import { differenceInMilliseconds, formatDistanceStrict } from "date-fns";
import admin from "firebase-admin";

import { User } from "../src/types/User";
import { AnyVenue } from "../src/types/venues";
import { WithId, withId } from "../src/utils/id";

import {
  FieldValue,
  initFirebaseAdminApp,
  makeScriptUsage,
} from "./lib/helpers";
import { DocumentData, DocumentReference } from "./lib/types";

const usage = makeScriptUsage({
  description: "Simulate user location updates to load test the platform",
  usageParams:
    "PROJECT_ID VENUE_ID USER_COUNT [UPDATE_CYCLE_INTERVAL_MS] [CREDENTIAL_PATH]",
  exampleParams:
    "co-reality-map myvenue 50 1000 [theMatchingAccountServiceKey.json]",
});

const [
  projectId,
  venueId,
  _userCount,
  _cycleInterval,
  credentialPath,
] = process.argv.slice(2);

const UPDATE_CYCLE_INTERVAL_MS_LIMIT = 1000;

const cycleInterval = _cycleInterval
  ? Number.parseInt(_cycleInterval, 10)
  : UPDATE_CYCLE_INTERVAL_MS_LIMIT;
const userCount = Number.parseInt(_userCount, 10);

// Note: no need to check credentialPath here as initFirebaseAdmin defaults it when undefined
if (
  !projectId ||
  !Number.isFinite(userCount) ||
  !venueId ||
  !(Number.isFinite(cycleInterval) && cycleInterval > 0)
) {
  usage();
}

if (cycleInterval < UPDATE_CYCLE_INTERVAL_MS_LIMIT) {
  console.error(`
  Error: Can only update each user's document at most once per second. Pick a number >= ${UPDATE_CYCLE_INTERVAL_MS_LIMIT}ms
  `);
  process.exit(1);
}

initFirebaseAdminApp(projectId, {
  credentialPath: credentialPath
    ? resolve(__dirname, credentialPath)
    : undefined,
});

type EnterVenueOptions = {
  userRef: DocumentReference<DocumentData>;
  venueId: string;
};
const enterVenue = async ({ userRef, venueId }: EnterVenueOptions) => {
  const user = (await userRef.get()).data();

  if (!user) {
    return console.error(
      `No user with id ${userRef.id} that can enter ${venueId}`
    );
  }

  if (user.enteredVenueIds?.includes(venueId)) {
    return; // already in venue
  }

  console.log(`User ${userRef.id} TRIES to enter ${venueId}`);

  await userRef.update({ enteredVenueIds: FieldValue.arrayUnion(venueId) });

  console.log(`User ${userRef.id} DOES enter ${venueId}`);
};

type TakeSeatOptions = {
  userRef: DocumentReference<DocumentData>;
  venue: WithId<AnyVenue>;
  index: number;
  count: number;
};
const takeSeat = async ({ userRef, venue, index, count }: TakeSeatOptions) => {
  const venueId = venue.id;
  const venueName = venue.name;

  await enterVenue({ userRef, venueId });

  const now = Date.now();
  const row = Math.round(0.5 + 24 * Math.random()) - 12;
  const col = Math.round(0.5 + 24 * Math.random()) - 12;

  const locationUpdate = userRef.update({
    lastSeenAt: now,
    lastSeenIn: { [venueName]: now },
  });

  const gridUpdate = userRef.update({
    [`data.${venueId}`]: {
      row: row,
      column: col,
    },
  });

  return Promise.all([locationUpdate, gridUpdate]).then(
    ([locationResult, gridResult]) => {
      const latterUpdateTime =
        locationResult.writeTime.toMillis() > gridResult.writeTime.toMillis()
          ? locationResult.writeTime
          : gridResult.writeTime;

      const updatedAt = latterUpdateTime.toDate().toISOString();

      console.log(
        `[${updatedAt}] Updated (${index}/${count}) (userId)=(${userRef.id}) w/ (time,row,column)=(${now},${row},${col})`
      );
    }
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const typeIsUser = (u: any): u is User => u?.partyName && u?.pictureUrl;

const main = async () => {
  const firestore = admin.firestore();
  const userRefs = await Promise.all([
    ...(await firestore.collection("users").listDocuments()).map(
      async (ref) => {
        const snap = await ref.get();
        if (!snap.exists) return;
        const user = snap.data();
        if (!typeIsUser(user)) return;
        return ref;
      }
    ),
  ]);

  const venueRef = firestore.collection("venues").doc(venueId);

  console.log(`
    Checking that venue exists for this test:
    venueId          = ${venueId}
  `);

  const [venueDoc] = await Promise.all([venueRef.get()]);

  const venueData = venueDoc.data() as AnyVenue | undefined;
  const venue = venueData ? withId(venueData, venueDoc.id) : undefined;

  if (!venue) throw new Error("venue not found");
  if (!venue.name) throw new Error("unable to extract venue's name");

  console.log(`
    Both users and venue look good now. Starting load test...
    updateIntervalMs = ${cycleInterval} (milliseconds)
  `);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const stats: Record<string, any> = {
    startTime: Date.now(),
    cycles: 0,
    updates: 0,
    writes: 0,
  };

  const runUpdateCycle = () => {
    const count = Math.min(userRefs.length, userCount);
    Promise.all([
      userRefs.slice(0, count).map(
        (userRef, index) =>
          userRef &&
          takeSeat({ userRef, venue, index, count }).then((result) => {
            stats.updates += 1;
            stats.writes += 2;
            return result;
          })
      ),
    ])
      .catch((reason) =>
        console.error(`[${stats.cycles} cycle]`, "Error:", reason)
      )
      .finally(() => (stats.cycles += 1));
  };

  // Run the first update straight away
  runUpdateCycle();

  // Then keep running the updates every interval after that
  const intervalId = setInterval(runUpdateCycle, cycleInterval);

  // Wait until user tries to exit with CTRL-C
  await new Promise((resolve) => {
    console.log("\nPress CTRL-C to exit..\n");

    process.on("SIGINT", () => {
      clearInterval(intervalId);

      console.log("\nCTRL-C detected, stopping load test..\n");

      // This is just used to complete the promise, the value is irrelevant
      resolve(undefined);
    });
  });

  stats.endTime = Date.now();
  stats.totalTime = formatDistanceStrict(stats.endTime, stats.startTime);
  stats.averageUpdateIntervalMillis =
    differenceInMilliseconds(stats.endTime, stats.startTime) / stats.cycles;

  console.log(`Load test ran finished. Stats:`, JSON.stringify(stats, null, 2));
};

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
