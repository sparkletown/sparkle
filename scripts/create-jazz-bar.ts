import admin from "firebase-admin";
import serviceAccount from "./prodAccountKey.json";
import "firebase/firestore";
import { JazzbarVenue } from "../src/types/JazzbarVenue";
import { VenueTemplate } from "../src/types/VenueTemplate";

function usage() {
  console.log(`
${process.argv[1]}: Create jazz bar

Usage: node ${process.argv[1]} PROJECT_ID VENUE_NAME IFRAME_URL LOGO_IMAGE_URL PROFILE_QUESTIONS CODE_OF_CONDUCT_QUESTIONS

Example: node ${process.argv[1]} co-reality-map jazzyjeff https://youtube.com/embed/abc /logo.png "question1?,question2?" "I will seek out the fun,I will add to the fun"
`);
  process.exit(1);
}

const argv = process.argv.slice(2);
if (argv.length < 6) {
  usage();
}

const projectId = argv[0];
const name = argv[1];
const iframeUrl = argv[2];
const logoImageUrl = argv[3];
const iconUrl = argv[4];
const profile_questions = argv[5]
  .split(",")
  .map((q, index) => ({ name: index.toString(), text: q.trim() }));
const code_of_conduct_questions = argv[6]
  .split(",")
  .map((q, index) => ({ name: index.toString(), text: q.trim() }));

const jazzbar: JazzbarVenue = {
  template: VenueTemplate.jazzbar,
  name,
  iframeUrl,
  logoImageUrl,
  host: {
    icon: iconUrl,
  },
  profile_questions,
  code_of_conduct_questions,
};

const venueId = name.replace(/\W/g, "").toLowerCase();

admin.initializeApp({
  credential: admin.credential.cert((serviceAccount as unknown) as string),
  databaseURL: `https://${projectId}.firebaseio.com`,
  storageBucket: `${projectId}.appspot.com`,
});

admin
  .firestore()
  .collection("venues")
  .doc(venueId)
  .get()
  .then((doc) => {
    if (doc.exists) {
      console.error("Error: Trying to create an existing venue");
      process.exit(1);
    }
    admin
      .firestore()
      .collection("venues")
      .doc(venueId)
      .set(jazzbar)
      .then(() => {
        console.log(`Added doc ${venueId}.`);
      });
  });
