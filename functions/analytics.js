const fs = require("fs");
const os = require("os");
const path = require("path");

const admin = require("firebase-admin");
const functions = require("firebase-functions");
const lodash = require("lodash");

const { formatSecondsAsHHMMSS } = require("./src/utils/time");
const { checkIsAdmin } = require("./src/utils/permissions");
const { checkAuth } = require("./src/utils/assert");

const { chunk, flatten } = lodash;

const functionsConfig = functions.config();

const getUsersWithVisits = async (venueIdsArray) => {
  const dto = flatten(
    await chunk(venueIdsArray, 10)
      .map(async (idsArray) => {
        return await admin
          .firestore()
          .collection("users")
          .where("enteredVenueIds", "array-contains-any", idsArray)
          .get()
          .then((usersSnapshot) =>
            usersSnapshot.docs.map(async (userDoc) => {
              const user = { ...userDoc.data(), id: userDoc.id };

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
      .map((el) => el.then((res) => flatten(res)))
  );
  return Promise.all(await dto);
};

const getWorldBySlug = async ({ worldSlug }) => {
  const matchingWorlds = await admin
    .firestore()
    .collection("worlds")
    .where("slug", "==", worldSlug)
    .get();

  if (matchingWorlds.empty) {
    throw new HttpsError(
      "internal",
      `The world with ${worldSlug} does not exist`
    );
  }

  const [world] = matchingWorlds.docs;
  return world;
};

exports.generateAnalytics = functions.https.onCall(async (data, context) => {
  checkAuth(context);

  if (!context.auth) {
    throw new HttpsError("internal", `No authentication context`);
  }

  if (!data.worldSlug) {
    throw new HttpsError("internal", `World slug missing`);
  }

  await checkIsAdmin(context.auth.token.user_id);

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

  // TODO: CHECK IF ADMIN
  // TODO: extract this as a generic helper function?
  const usersWithVisits = await Promise.all(
    await getUsersWithVisits(spaceIds).then((res) => flatten(res))
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
  ).then((result) => flatten(result));

  const authUsersById = authUsers.reduce(
    (acc, authUser) => ({ ...acc, [authUser.uid]: authUser }),
    {}
  );

  // TODO: filter enteredVenueIds and visitsTimeSpent so that they only contain related venues?
  const result = usersWithVisits
    .reduce((arr, userWithVisits) => {
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
          (visitsArr, visit) => {
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

    const getVisitData = (visitName) =>
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

    const result = formattedVisitColumns.map((visit) => visit.timeValue || 0);

    return result;
  });

  // space between visit data & total data
  [0, 1, 2].map(() =>
    fs.writeFileSync(dataReportFilePath, `\n`, { flag: "a" })
  );

  const arrayOfResults = [];

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

  const bucket = storage.bucket(`${functionsConfig.project.id}.appspot.com`);

  const [dataReportFile] = await bucket.upload(dataReportFilePath, {
    destination: `analytics/dataReportFile-${expiryDate}.csv`,
  });

  const [dataReportFileUrl] = await dataReportFile.getSignedUrl({
    action: "read",
    expires: expiryDate,
  });

  return {
    dataReportFileUrl,
  };
});
