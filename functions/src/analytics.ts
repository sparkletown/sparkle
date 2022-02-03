import * as fs from "fs";

import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { UserRecord } from "firebase-functions/v1/auth";
import { chunk } from "lodash";

import { HttpsFunctionHandler } from "./types/utility";
import { assertValidAuth } from "./utils/assert";
import { formatSecondsAsHHMMSS } from "./utils/time";

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

const getUsersWithVisits = async (venueIdsArray: string[]) => {
  const dto = await chunk(venueIdsArray, 10)
    .map(async (idsArray) => {
      return await admin
        .firestore()
        .collection("users")
        .where("enteredVenueIds", "array-contains-any", idsArray)
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
  venueIds: string[] | string | undefined;
}> = async (data, context) => {
  assertValidAuth(context);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  await checkIsAdmin(context.auth.token.user_id);

  const venueIdsArray = Array.isArray(data?.venueIds)
    ? data.venueIds
    : (data?.venueIds ?? "").split(",");

  // TODO: CHECK IF ADMIN
  // TODO: extract this as a generic helper function?
  const usersWithVisits: UserWithVisits[] = await Promise.all(
    await getUsersWithVisits(venueIdsArray).then((res) => res.flat())
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

  const allSpaceVisitsFileName = "allSpaceVisits.csv";

  // TODO: filter enteredVenueIds and visitsTimeSpent so that they only contain related venues?
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
      const visitIds = visits.map((el) => el.id);

      visitIds.map((visit) =>
        fs.writeFileSync(allSpaceVisitsFileName, `${visit} \n`, { flag: "a" })
      );

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

  const uniqueVenuesVisitedFileName = "uniqueVenuesVisited.csv";

  // write all unique venues
  globalUniqueVisits.map((el) =>
    fs.writeFileSync(uniqueVenuesVisitedFileName, `${el} \n`, { flag: "a" })
  );

  const dataReportFileName = "dataReport.csv";

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

    fs.writeFileSync(dataReportFileName, `${headingLine} \n`, { flag: "a" });
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

    fs.writeFileSync(dataReportFileName, `${csvFormattedLine} \n`, {
      flag: "a",
    });

    return formattedVisitColumns.map((visit) => visit.timeValue || 0);
  });

  // space between visit data & total data
  [0, 1, 2].map(() =>
    fs.writeFileSync(dataReportFileName, `\n`, { flag: "a" })
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

  fs.writeFileSync(dataReportFileName, `${uniqueVisitDataLine} \n`, {
    flag: "a",
  });
  fs.writeFileSync(dataReportFileName, `${averageVisitDataLine} \n`, {
    flag: "a",
  });

  const storage = await admin.storage();

  const TEN_MINUTES_IN_MS = 10 * 60 * 1000;

  // NOTE: Expire 10 minutes from now
  const expiryDate = new Date().getTime() + TEN_MINUTES_IN_MS;

  // noinspection SpellCheckingInspection
  const bucket = storage.bucket(`${functionsConfig.project.id}.appspot.com`);

  const [dataReportFile] = await bucket.upload(dataReportFileName, {
    destination: `analytics/dataReportFile-${expiryDate}.csv`,
  });

  const [allSpaceVisitsFile] = await bucket.upload(allSpaceVisitsFileName, {
    destination: `analytics/allSpaceVisits-${expiryDate}.csv`,
  });

  const [uniqueVenuesVisitedFile] = await bucket.upload(
    uniqueVenuesVisitedFileName,
    {
      destination: `analytics/uniqueVenuesVisited-${expiryDate}.csv`,
    }
  );

  const [dataReportFileUrl] = await dataReportFile.getSignedUrl({
    action: "read",
    expires: expiryDate,
  });

  const [allSpaceVisitsFileUrl] = await allSpaceVisitsFile.getSignedUrl({
    action: "read",
    expires: expiryDate,
  });

  const [
    uniqueVenuesVisitedFileUrl,
  ] = await uniqueVenuesVisitedFile.getSignedUrl({
    action: "read",
    expires: expiryDate,
  });

  return {
    dataReportFileUrl,
    allSpaceVisitsFileUrl,
    uniqueVenuesVisitedFileUrl,
  };
};

exports.generateAnalytics = functions.https.onCall(generateAnalytics);
