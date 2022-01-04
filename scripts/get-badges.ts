#!/usr/bin/env node -r esm -r ts-node/register

import fs from "fs";
import { resolve } from "path";

import admin from "firebase-admin";
import { chunk } from "lodash";

import { UserVisit } from "../src/types/Firestore";
import { User } from "../src/types/User";
import { WithId, withId } from "../src/utils/id";
import { formatSecondsAsHHMMSS } from "../src/utils/time";

import {
  initFirebaseAdminApp,
  makeScriptUsage,
  parseCredentialFile,
} from "./lib/helpers";

const usage = makeScriptUsage({
  description:
    "Retrieve 'badge' details (in CSV format) of users who entered the specified venue(s), and how long they spent in each.",
  usageParams: "VENUE_IDS [CREDENTIAL_PATH]",
  exampleParams:
    "venueId,venueId2,venueIdN [theMatchingAccountServiceKey.json]",
});

const [venueIds, credentialPath] = process.argv.slice(2);

const { project_id: projectId } = parseCredentialFile(credentialPath);

// Note: no need to check credentialPath here as initFirebaseAdmin defaults it when undefined
if (!projectId || !venueIds) {
  usage();
}

const venueIdsArray = venueIds.split(",");

initFirebaseAdminApp(projectId, {
  credentialPath: credentialPath
    ? resolve(__dirname, credentialPath)
    : undefined,
});

const getUsersWithVisits = async () => {
  const dto = await chunk(venueIdsArray, 10)
    .map(async (idsArray) => {
      return await admin
        .firestore()
        .collection("users")
        .where("enteredVenueIds", "array-contains-any", idsArray)
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
        );
    })
    .map((el) => el.then((res) => res.flat()))
    .flat();
  return Promise.all(await dto);
};

interface UsersWithVisitsResult {
  user: WithId<User>;
  visits: WithId<UserVisit>[];
}

(async () => {
  // TODO: extract this as a generic helper function?
  const usersWithVisits: UsersWithVisitsResult[] = await Promise.all(
    await getUsersWithVisits().then((res) => res.flat())
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
    .reduce((arr: UsersWithVisitsResult[], userWithVisits) => {
      const { user, visits } = userWithVisits;
      const { id } = user;
      const { email } = authUsersById[id] ?? {};

      // filter out @sparkle users
      if (email?.includes("@sparkle.space")) {
        return arr;
      }

      const matchingUserIndex = arr.findIndex(
        (item) => item.user.partyName === user.partyName
      );

      if (matchingUserIndex > 0) {
        const newArr = [...arr[matchingUserIndex].visits, ...visits].reduce(
          (visitsArr: WithId<UserVisit>[], visit) => {
            if (visitsArr.map((arrVisit) => arrVisit.id).includes(visit.id)) {
              return visitsArr;
            }

            visitsArr.push(visit);

            return visitsArr;
          },
          []
        );

        arr[matchingUserIndex] = { ...userWithVisits, visits: newArr };

        return arr;
      }

      arr.push(userWithVisits);

      return arr;
    }, [])
    .map((userWithVisits) => {
      const { user, visits } = userWithVisits;
      const { id, partyName } = user;
      const { email } = authUsersById[id] ?? {};
      const visitIds = visits.map((el) => el.id);

      visitIds.map((visit) =>
        fs.writeFileSync("./allSpaceVisits.csv", `${visit} \n`, { flag: "a" })
      );

      return {
        id,
        email,
        partyName,
        visits,
      };
    })
    .filter((user) => !!user.visits.length);

  const allResultVisits: string[] = result.reduce((arr: string[], el) => {
    const result: string[] = el.visits.map((e) => e.id);

    result.forEach((e) => arr.push(e));

    return arr;
  }, []);

  const globalUniqueVisits = [...new Set(allResultVisits)];

  // write all unique venues
  globalUniqueVisits.map((el) =>
    fs.writeFileSync("./uniqueVenuesVisited.csv", `${el} \n`, { flag: "a" })
  );

  // Write user venue headings
  (() => {
    const headingLine = [
      "Email",
      "Party Name",
      "Rooms Entered",
      ...globalUniqueVisits,
    ]
      .map((heading) => `"${heading}"`)
      .join(",");

    fs.writeFileSync("./dataReport.csv", `${headingLine} \n`, { flag: "a" });
  })();

  let globalVisitsValue = 0;

  // Write all user data for analytics
  const allDataResult = result.map((user) => {
    const onlyVisitIds = user.visits.map((el) => el.id);

    const getVisitData = (visitName: string) =>
      user.visits.find((visit) => (visit.id === visitName ? visit : 0)) || {
        timeSpent: 0,
        id: 0,
      };

    const formattedVisitColumns = globalUniqueVisits.map((visit) => {
      if (onlyVisitIds.includes(visit) && getVisitData(visit)) {
        return {
          timeValue: getVisitData(visit).timeSpent,
          formattedTime: `${formatSecondsAsHHMMSS(
            getVisitData(visit).timeSpent
          )}`,
        };
      }
      return {};
    });

    const bodyVisitColumns = formattedVisitColumns.map(
      (column) => column?.formattedTime ?? ""
    );

    const dto = [
      user.email,
      user.partyName,
      user.visits.length,
      ...bodyVisitColumns,
    ];

    globalVisitsValue += user.visits.length;

    const csvFormattedLine = dto.map((s) => `"${s}"`).join(",");

    fs.writeFileSync("./dataReport.csv", `${csvFormattedLine} \n`, {
      flag: "a",
    });

    const result = formattedVisitColumns.map((visit) => visit.timeValue ?? 0);

    return result;
  });

  // space between visit data & total data
  [0, 1, 2].map(() =>
    fs.writeFileSync("./dataReport.csv", `\n`, { flag: "a" })
  );

  const arrayOfResults: {
    totalAmount: number;
    totalValue: number;
    totalUnique: number;
  }[] = [];

  allDataResult.forEach((item) => {
    item.forEach((res, i) => {
      arrayOfResults[i] = arrayOfResults[i]
        ? {
            totalAmount: arrayOfResults[i].totalAmount + 1,
            totalValue: arrayOfResults[i].totalValue + res,
            totalUnique: res
              ? arrayOfResults[i].totalUnique + 1
              : arrayOfResults[i].totalUnique,
          }
        : { totalValue: res, totalAmount: 1, totalUnique: res ? 1 : 0 };
    });
  });

  const uniqueVisitDataLine = [
    "Total Unique",
    "",
    allDataResult.length,
    ...arrayOfResults.map((el) => el.totalUnique),
  ];

  const averageVisitDataLine = [
    "Average Time",
    "",
    (globalVisitsValue / allDataResult.length).toFixed(2),
    ...arrayOfResults.map(
      (el) =>
        `${formatSecondsAsHHMMSS(Math.round(el.totalValue / el.totalAmount))}`
    ),
  ];

  fs.writeFileSync("./dataReport.csv", `${uniqueVisitDataLine} \n`, {
    flag: "a",
  });
  fs.writeFileSync("./dataReport.csv", `${averageVisitDataLine} \n`, {
    flag: "a",
  });
})()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
