import * as fs from "fs";
import * as os from "os";
import * as path from "path";

import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { UserRecord } from "firebase-functions/v1/auth";
import { HttpsError } from "firebase-functions/v1/https";
import { chunk } from "lodash";

import { HttpsFunctionHandler } from "./types/utility";
import { assertValidAuth } from "./utils/assert";
import { throwErrorIfNotSuperAdmin } from "./utils/permissions";
import { formatSecondsAsHHMMSS } from "./utils/time";
import { getWorldBySlug } from "./utils/world";

const functionsConfig = functions.config();

type TimedVisit = { id: string | number; timeSpent: number };
type UntimedVisit = { id: string | number; timeSpent?: number };
type Visit = TimedVisit | UntimedVisit;

interface UserWithVisits {
  user: {
    id: string;
    partyName?: string;
  };
  visits: UntimedVisit[];
}

const getUsersWithVisits = async (spaceIds: string[]) => {
  const dto = await chunk(spaceIds, 10)
    .map(async (spaceIdsChunk) => {
      return await admin
        .firestore()
        .collection("users")
        .where("enteredVenueIds", "array-contains-any", spaceIdsChunk)
        .get()
        .then((usersSnapshot) =>
          usersSnapshot.docs.map(async (userDoc) => {
            const user = { ...userDoc.data(), id: userDoc.id };

            // @debt redo this part, so that there's no nesting
            // eslint-disable-next-line promise/no-nesting
            const visits = await userDoc.ref
              .collection("visits")
              .get()
              .then((visitsSnapshot) =>
                visitsSnapshot.docs.map((visitDoc) => ({
                  ...visitDoc.data(),
                  id: visitDoc.id,
                }))
              );

            return { user, visits };
          })
        );
    })
    .map((el) => el.then((res) => res.flat()))
    .flat();
  return Promise.all(await dto);
};

const generateAnalytics: HttpsFunctionHandler<{
  worldSlug: string | undefined;
}> = async (data, context) => {
  assertValidAuth(context);

  if (!context.auth) {
    throw new HttpsError("internal", `No authentication context`);
  }

  if (!data.worldSlug) {
    throw new HttpsError("internal", `World slug missing`);
  }

  await throwErrorIfNotSuperAdmin(context.auth.token.user_id);

  const world = await getWorldBySlug({ worldSlug: data.worldSlug });

  const worldId = world.id;

  const matchingSpaces = await admin
    .firestore()
    .collection("venues")
    .where("worldId", "==", worldId)
    .get();

  if (matchingSpaces.empty) {
    throw new HttpsError(
      "internal",
      `The world ${data.worldSlug} does not have any venues`
    );
  }

  const spaceIds = matchingSpaces.docs.map((space) => space.id);
  // TODO: extract this as a generic helper function?
  const usersWithVisits: UserWithVisits[] = await Promise.all(
    await getUsersWithVisits(spaceIds).then((res) => res.flat())
  );

  // TODO: extract this as a generic helper function?
  // Note: 100 is the max that can be requested with getUsers() per chunk
  const authUsers = await Promise.all(
    chunk(usersWithVisits, 100).map(async (usersWithVisitsChunk) => {
      const chunkUserIds = usersWithVisitsChunk.map((userWithVisits) => ({
        uid: userWithVisits.user.id,
      }));

      const authUsersResult = await admin.auth().getUsers(chunkUserIds);

      return authUsersResult.users;
    })
  ).then((result) => result.flat());

  const authUsersById: Record<string, UserRecord> = authUsers.reduce(
    (acc, authUser) => ({ ...acc, [authUser.uid]: authUser }),
    {}
  );

  // TODO: filter enteredspaceIds and visitsTimeSpent so that they only contain related venues?
  const result = usersWithVisits
    .reduce((arr: UserWithVisits[], userWithVisits) => {
      const { user, visits } = userWithVisits;
      const { id } = user;
      const { email } = authUsersById[id] || {};

      // filter out @sparkle users
      if (email && email.includes("@sparkle.space")) {
        return arr;
      }

      const matchingUserIndex = arr.findIndex(
        (item) => item.user.partyName === user.partyName
      );

      if (matchingUserIndex > 0) {
        const newArr = [...arr[matchingUserIndex].visits, ...visits].reduce(
          (visitsArr: UntimedVisit[], visit: UntimedVisit) => {
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
      const { email } = authUsersById[id] || {};

      return {
        id,
        email,
        partyName,
        visits,
      };
    })
    .filter((user) => Boolean(user.visits.length));

  const allResultVisits = result.reduce((arr, el) => {
    const result = el.visits.map((e) => e.id);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    result.forEach((e) => arr.push(e));

    return arr;
  }, []);

  const globalUniqueVisits = [...new Set(allResultVisits)];

  const dataReportFileName = "dataReport.csv";

  const dataReportFilePath = path.join(os.tmpdir(), dataReportFileName);

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
    fs.writeFileSync(dataReportFilePath, `${headingLine} \n`, { flag: "a" });
  })();

  let globalVisitsValue = 0;

  // Write all user data for analytics
  const allDataResult = result.map((user) => {
    const onlyVisitIds = user.visits.map((el) => el.id);

    const getVisitData: (visitName: string) => Visit = (visitName) => {
      const found: UntimedVisit | undefined = user.visits.find((visit) =>
        visit.id === visitName ? visit : 0
      );
      return found
        ? found
        : {
            timeSpent: 0,
            id: 0,
          };
    };

    const formattedVisitColumns = globalUniqueVisits.map((visit: string) => {
      if (onlyVisitIds.includes(visit) && getVisitData(visit)) {
        const timeSpent = getVisitData(visit).timeSpent;
        return {
          timeValue: timeSpent,
          formattedTime: `${formatSecondsAsHHMMSS(timeSpent ?? 0)}`,
        };
      }
      return {};
    });

    const bodyVisitColumns = formattedVisitColumns.map(
      (column) => (column && column.formattedTime) || ""
    );

    const dto = [
      user.email,
      user.partyName,
      user.visits.length,
      ...bodyVisitColumns,
    ];

    globalVisitsValue += user.visits.length;

    const csvFormattedLine = dto.map((s) => `"${s}"`).join(",");

    fs.writeFileSync(dataReportFilePath, `${csvFormattedLine} \n`, {
      flag: "a",
    });

    return formattedVisitColumns.map((visit) => visit.timeValue || 0);
  });

  // space between visit data & total data
  [0, 1, 2].map(() =>
    fs.writeFileSync(dataReportFilePath, `\n`, { flag: "a" })
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

  fs.writeFileSync(dataReportFilePath, `${uniqueVisitDataLine} \n`, {
    flag: "a",
  });
  fs.writeFileSync(dataReportFilePath, `${averageVisitDataLine} \n`, {
    flag: "a",
  });

  const storage = await admin.storage();

  const TEN_MINUTES_IN_MS = 10 * 60 * 1000;

  // NOTE: Expire 10 minutes from now
  const expiryDate = new Date().getTime() + TEN_MINUTES_IN_MS;

  // noinspection SpellCheckingInspection
  const bucket = storage.bucket(`${functionsConfig.project.id}.appspot.com`);

  const [dataReportFile] = await bucket.upload(dataReportFilePath, {
    destination: `analytics/dataReportFile-${expiryDate}.csv`,
  });

  const [dataReportFileUrl] = await dataReportFile.getSignedUrl({
    action: "read",
    expires: expiryDate,
  });

  // eslint-disable-next-line consistent-return
  return {
    dataReportFileUrl,
  };
};

exports.generateAnalytics = functions.https.onCall(generateAnalytics);
