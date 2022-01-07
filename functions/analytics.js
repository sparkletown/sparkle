const fs = require("fs");
const admin = require("firebase-admin");
const functions = require("firebase-functions");
const lodash = require("lodash");

const { formatSecondsAsHHMMSS } = require("./src/utils/time");

const { chunk } = lodash;

const venueIds = "mypartymap";

const venueIdsArray = venueIds.split(",");

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
            const user = { ...userDoc.data(), id: userDoc.id };

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

exports.formCSV = functions.https.onCall(async (data, context) => {
  // TODO: CHECK IF ADMIN
  // TODO: extract this as a generic helper function?
  const usersWithVisits = await Promise.all(
    await getUsersWithVisits().then((res) => res.flat())
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

  const authUsersById = authUsers.reduce(
    (acc, authUser) => ({ ...acc, [authUser.uid]: authUser }),
    {}
  );

  const allSpaceVisitsFile = fs.writeFile("allSpaceVisits.csv", [
    "allSpaceVisits",
    { flag: "a" },
    () => {},
  ]);
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
      const visitIds = visits.map((el) => el.id);

      visitIds.map((visit) =>
        fs.writeFileSync(allSpaceVisitsFile, `${visit} \n`, { flag: "a" })
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

    result.forEach((e) => arr.push(e));

    return arr;
  }, []);

  const globalUniqueVisits = [...new Set(allResultVisits)];

  const uniqueVenuesVisitedFile = fs.writeFile("uniqueVenuesVisited.csv", [
    "uniqueVenuesVisited",
    { flag: "a" },
    () => {},
  ]);

  // write all unique venues
  globalUniqueVisits.map((el) =>
    fs.writeFileSync(uniqueVenuesVisitedFile, `${el} \n`, { flag: "a" })
  );

  const dataReportFile = fs.writeFile(
    "dataReport.csv",
    ["dataReport"],
    { flag: "a" },
    () => {}
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

    fs.writeFileSync(dataReportFile, `${headingLine} \n`, { flag: "a" });
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

    fs.writeFileSync(dataReportFile, `${csvFormattedLine} \n`, {
      flag: "a",
    });

    const result = formattedVisitColumns.map((visit) => visit.timeValue || 0);

    return result;
  });

  // space between visit data & total data
  [0, 1, 2].map(() => fs.writeFileSync(dataReportFile, `\n`, { flag: "a" }));

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

  fs.writeFileSync(dataReportFile, `${uniqueVisitDataLine} \n`, {
    flag: "a",
  });
  fs.writeFileSync(dataReportFile, `${averageVisitDataLine} \n`, {
    flag: "a",
  });

  const storage = await admin.storage().bucket();

  storage.upload(dataReportFile, {
    destination: "analytics/dataReportFile.csv",
  });

  // TODO: SAVE FILE INTO STORAGE
  // TODO: SEND LINK VIA EMAIL
});
