const admin = require("firebase-admin");
const functions = require("firebase-functions");
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

exports.createVenue = functions.https.onCall(async (data, context) => {
  if (!context.auth || !context.auth.token) {
    throw new functions.https.HttpsError("unauthenticated", "Please log in");
  }

  if (context.auth.token.aud !== PROJECT_ID) {
    throw new functions.https.HttpsError("permission-denied", "Token invalid");
  }

  // @debt this should be typed
  const venueData = {
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
        eventbriteEventId: "00000000000",
        joinButtonText: "Enter our venue",
        description: data.longDescription,
      },
    },
    presentation: [data.longDescription],
    quotations: [{ author: "Max", text: "'Bullish on life' Bull" }],
    subtitle: data.tagline,
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
  };

  await admin
    .firestore()
    .collection("venues")
    .doc(data.name.replace(/\W/g, "").toLowerCase())
    .set(venueData);

  return venueData;
});
