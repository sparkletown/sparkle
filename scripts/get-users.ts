import admin from "firebase-admin";
import serviceAccount from "./prodAccountKey.json";
import "firebase/firestore";
import validCodes from "./validCodes.json";

function usage() {
  console.log(`
${process.argv[1]}: Get user details. Prints each user's email address, last seen time in milliseconds since epoch, and codes used.

Usage: node ${process.argv[1]} PROJECT_ID

Example: node ${process.argv[1]} co-reality-map
`);
  process.exit(1);
}

const argv = process.argv.slice(2);
if (argv.length < 1) {
  usage();
}

const projectId = argv[0];

admin.initializeApp({
  credential: admin.credential.cert((serviceAccount as unknown) as string),
  databaseURL: `https://${projectId}.firebaseio.com`,
  storageBucket: `${projectId}.appspot.com`,
});

(async () => {
  const allUsers: admin.auth.UserRecord[] = [];
  let nextPageToken: string;
  const { users, pageToken } = await admin.auth().listUsers(1000);
  allUsers.push(...users);
  nextPageToken = pageToken;
  while (nextPageToken) {
    const { users, pageToken } = await admin
      .auth()
      .listUsers(1000, nextPageToken);
    allUsers.push(...users);
    nextPageToken = pageToken;
  }

  console.log(
    [
      "Email",
      "Party Name",
      "Last Sign In",
      "Total Duration",
      "Codes Used",
      "Valid Codes Used",
      "Distinct Codes Used",
      "Valid Distinct Codes Used",
      "Invalid Distinct Codes Used",
    ]
      .map((heading) => `"${heading}"`)
      .join(",")
  );
  const firestoreUsers = await admin.firestore().collection("users").get();
  firestoreUsers.docs.forEach((doc) => {
    const user = allUsers.find((u) => u.uid === doc.id);
    const partyName = doc.data().partyName;
    const lastSignInTime = new Date(user.metadata.lastSignInTime).getTime();
    const lastSeenAt = (doc.data().lastSeenAt || 0) * 1000;
    const sessionLengthDays =
      Math.max(0, lastSeenAt - lastSignInTime) / (3600 * 1000 * 24);
    const codesUsed = doc.data().codes_used ?? [];
    const validCodesUsed = codesUsed.filter((code) =>
      validCodes.includes(code)
    );
    const distinctCodesUsed = codesUsed.filter((v, i, a) => a.indexOf(v) === i);
    const validDistincCodesUsed = validCodesUsed.filter(
      (v, i, a) => a.indexOf(v) === i
    );
    console.log(
      [
        user?.email ?? doc.id,
        partyName,
        new Date(lastSignInTime).toISOString(),
        sessionLengthDays,
        codesUsed.length,
        validCodesUsed.length,
        distinctCodesUsed.length,
        validDistincCodesUsed.length,
        distinctCodesUsed.length - validDistincCodesUsed.length,
      ]
        .map((v) => `"${v}"`)
        .join(",")
    );
  });
  process.exit(0);
})();
