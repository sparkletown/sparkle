import fs from "fs";
import admin from "firebase-admin";
import serviceAccount from "./prodAccountKey.json";
import "firebase/firestore";

const CODES_FILE_PATH = "codes.txt";
const codes = fs
  .readFileSync(CODES_FILE_PATH)
  .toString()
  .split("\n")
  .map((line) => line.toLowerCase());

function usage() {
  console.log(`
${process.argv[1]}: Print attendees' emails, based on codes_used

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
  const userprivateCollection = await admin
    .firestore()
    .collection("userprivate")
    .get();
  const codesUsed = [];
  userprivateCollection.forEach((doc) => {
    if (!doc.exists || !doc.data().codes_used) return;
    doc.data().codes_used.map((c) => codesUsed.push(c));
  });

  const emailsWhoLoggedIn = codes.filter((code) => codesUsed.includes(code));

  console.log(
    `Email addresses of users who logged in (total ${emailsWhoLoggedIn.length}):`
  );
  emailsWhoLoggedIn.sort().forEach((e) => console.log(e));

  process.exit(0);
})();
