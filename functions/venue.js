const admin = require("firebase-admin");
const functions = require("firebase-functions");
const { checkAuth } = require("./auth");
const PROJECT_ID = functions.config().project.id;

// interface Question {
//   name: string;
//   text: string;
// }

// interface CreateVenueData {
//   name: string;
//   mapIconImageUrl?: string;
//   bannerImageUrl: string;
//   logoImageUrl: string;
//   tagline: string;
//   longDescription: string;
//   profileQuestions: Array<Question>
// }

// interface Venue {
//   id?: string;
//   template: VenueTemplate;
//   name: string;
//   config: {
//     theme: {
//       primaryColor: string;
//       backgroundColor?: string;
//     };
//     landingPageConfig: {
//       coverImageUrl: string;
//       subtitle: string;
//       presentation: string[];
//       checkList: string[];
//       videoIframeUrl: string;
//       joinButtonText: string;
//       quotations?: Quotation[];
//     };
//     memberEmails?: string[];
//   };
//   host: {
//     icon: string;
//   };
//   profile_questions: Question[];
//   code_of_conduct_questions: Question[];
//   iframeUrl?: string;
//   events?: Array<UpcomingEvent>;
// }

const createVenueData = (data, context) => ({
  code_of_conduct_questions: [
    {
      name: "contributeToExperience",
      text: "Are you willing ton contribute to the experience?",
    },
  ],
  config: {
    landingPageConfig: {
      checkList: ["Enjoy our amazing venue"],
      coverImageUrl: data.bannerImageUrl,
      joinButtonText: "Enter our venue",
      subtitle: data.tagline,
      description: data.longDescription,
    },
  },
  presentation: [data.longDescription],
  quotations: [{ author: "Max", text: "'Bullish on life' Bull" }],
  videoIframeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  theme: {
    primaryColor: "#bc271a",
  },
  host: {
    icon: data.logoImageUrl,
  },
  iframeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  name: data.name,
  profile_questions: [{ name: "Dance", text: "Do you dance?" }],
  template: "jazzbar",
  owners: [context.auth.token.user_id],
  profile_questions: data.profileQuestions,
  //@debt need to do something with mapIconUrl
});

exports.createVenue = functions.https.onCall(async (data, context) => {
  checkAuth(context);

  // @debt this should be typed
  const venueData = createVenueData(data, context);

  await admin
    .firestore()
    .collection("venues")
    .doc(data.name.replace(/\W/g, "").toLowerCase())
    .set(venueData);

  return venueData;
});

exports.updateVenue = functions.https.onCall(async (data, context) => {
  console.log("HELLO");
  checkAuth(context);

  // @debt this should be typed
  const venueData = createVenueData(data, context);

  await admin
    .firestore()
    .collection("venues")
    .doc(data.name.replace(/\W/g, ""))
    .update(venueData);

  return venueData;
});
