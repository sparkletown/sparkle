#!/usr/bin/env node -r esm -r ts-node/register

import fs from "fs";
import { resolve } from "path";

import { parse } from "csv-parse/sync";
import admin from "firebase-admin";

import {
  checkFileExists,
  initFirebaseAdminApp,
  makeScriptUsage,
  parseCredentialFile,
} from "./lib/helpers";

const COL_TITLE = "TITLE";
const COL_THUMBNAIL = "THUMBNAIL";
const COL_INTRO_VIDEO_URL = "INTRO VIDEO URL";
const COL_IFRAME_URL = "IFRAME URL";
const COL_DESCRIPTION = "DESCRIPTION";
const COL_DESCRIPTION_SECONDARY = "SECONDARY DESCRIPTION";
const COL_CATEGORIES = "CATEGORIES";
const COL_POSTER_ID = "POSTER ID";
const COL_MORE_INFO_URL = "MORE INFO URL";
const COL_PRESENTER_NAME = "PRESENTER NAME";

// ---------------------------------------------------------
// HERE THERE BE DRAGONS (edit below here at your own risk)
// ---------------------------------------------------------

const usage = makeScriptUsage({
  description:
    "Upload posters to a poster hall. This will not delete existing posters.\n" +
    "It will replace any posters that belong to the same poster hall and have the" +
    " same ID\n\n" +
    "The CSV is expected to have a header column with the following headers\n" +
    " * Title - The title of the poster\n" +
    " * Thumbnail - A link to an image to use as a thumbnail for the poster\n" +
    " * Presenter name - The name of the person presenting the poster\n" +
    " * Intro Video URL - A URL for the intro vide for the poster\n" +
    " * IFrame URL - The URL to embed inside the poster\n" +
    " * Description - Description of the poster\n" +
    " * Secondary Description - A secondary description of the poster\n" +
    " * More info URL - A URL that attendees can go to for more information\n" +
    " * Categories - Comma separated list of categories\n" +
    " * Poster ID - Numeric ID for the poster. This is so that repeating uploads\n" +
    "   will update the existing poster rather than create a new one\n\n" +
    "These headings MUST BE EXACT or the upload will fail",
  usageParams: "CREDENTIAL_PATH CSV_PATH POSTER_HALL_SPACE_ID",
  exampleParams: "accountServiceKey.json my-posters.csv abc123SpaceId",
});

const [credentialPath, csvPath, posterHallSpaceId] = process.argv.slice(2);

if (!credentialPath) {
  usage();
}

if (!checkFileExists(credentialPath)) {
  console.error("Credential file path does not exists:", credentialPath);
  process.exit(1);
}

const { project_id: projectId } = parseCredentialFile(credentialPath);

if (!projectId) {
  console.error("Credential file has no project_id:", credentialPath);
  process.exit(1);
}

if (!csvPath) {
  console.error("CSV path must be specified");
  usage();
}

if (!posterHallSpaceId) {
  console.error("Poster hall space ID must be specified");
  usage();
}

const data = fs.readFileSync(csvPath, "utf-8");

const records = parse(data, {
  columns: (header) =>
    header.map((column: unknown) => String(column).toUpperCase()),
  skip_empty_lines: true,
});

initFirebaseAdminApp(projectId, {
  credentialPath: credentialPath
    ? resolve(__dirname, credentialPath)
    : undefined,
});

const db = admin.firestore();

db.runTransaction(async (transaction) => {
  const posterHall = await (
    await db.doc(`venues/${posterHallSpaceId}`).get()
  ).data();

  for (const posterCsv of records) {
    const posterId = posterCsv[COL_POSTER_ID];

    // Get the existing space for this poster if it exists
    const existingRef = await db
      .collection("venues")
      .where("parentId", "==", posterHallSpaceId)
      .where("posterId", "==", posterId)
      .get();
    const [existing] = existingRef.docs;

    const categories = posterCsv[COL_CATEGORIES].split(",").filter(
      (c: string) => c.length > 0
    );
    const payload = {
      poster: {
        description: posterCsv[COL_DESCRIPTION],
        descriptionSecondary: posterCsv[COL_DESCRIPTION_SECONDARY],
        introVideoUrl: posterCsv[COL_INTRO_VIDEO_URL],
        title: posterCsv[COL_TITLE],
        categories,
        thumbnailUrl: posterCsv[COL_THUMBNAIL],
        moreInfoUrl: posterCsv[COL_MORE_INFO_URL],
        presenterName: posterCsv[COL_PRESENTER_NAME],
      },
      iframeUrl: posterCsv[COL_IFRAME_URL],
    };

    if (existing) {
      transaction.set(existing.ref, payload, { merge: true });
    } else {
      // Generate a slug from the parent slug and the ID
      const slug = `${posterHall?.slug}-${posterId}`;
      const docRef = db.collection("venues").doc();

      transaction.set(docRef, {
        parentId: posterHallSpaceId,
        worldId: posterHall?.worldId,
        template: "posterpage",
        name: "",
        posterId,
        slug,
        ...payload,
      });
    }
  }
});
