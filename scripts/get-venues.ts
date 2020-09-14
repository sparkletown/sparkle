import admin from "firebase-admin";
import serviceAccount from "./prodAccountKey.json";
import "firebase/firestore";

function usage() {
  console.log(`
${process.argv[1]}: Get venue details. Prints venue name, type and other details.

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
      "Venue ID",
      "Venue Name",
      "Venue Type",
      "Tagline",
      "Long Description",
      "Zoom URL (if applicable)",
      "iframe URL (if applicable)",
      "Owner emails",
    ]
      .map((heading) => `"${heading}"`)
      .join(",")
  );
  const firestoreVenues = await admin.firestore().collection("venues").get();
  firestoreVenues.docs.forEach((doc) => {
    const venueId = doc.id;
    const venueName = doc.data().name;
    const venueTemplate = doc.data().template;
    const tagline = doc.data().config?.landingPageConfig?.subtitle;
    const longDescription = doc.data().config?.landingPageConfig?.description;
    const zoomUrl = doc.data().zoomUrl ?? "";
    const iframeUrl = doc.data().iframeUrl ?? "";
    const ownerEmails = (doc.data().owners ?? []).map(
      (ownerUid: string) => allUsers.find((u) => u.uid === ownerUid).email
    );

    console.log(
      [
        venueId,
        venueName,
        venueTemplate,
        tagline,
        longDescription,
        zoomUrl,
        iframeUrl,
        ownerEmails.join(","),
      ]
        .map(
          (v) =>
            `"${(v ?? "")
              .split('"')
              .join('\\"')
              .split(",")
              .join("\\,")
              .split("\n")
              .join(" ")}"`
        )
        .join(",")
    );
  });
  process.exit(0);
})();
