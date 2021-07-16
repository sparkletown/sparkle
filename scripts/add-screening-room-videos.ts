#!/usr/bin/env node -r esm -r ts-node/register

import fs from "fs";

import {
  checkFileExists,
  initFirebaseAdminApp,
  makeScriptUsage,
} from "./lib/helpers";

import { ScreeningRoomVideo } from "../src/types/screeningRoom";

// ---------------------------------------------------------
// HERE THERE BE DRAGONS (edit below here at your own risk)
// ---------------------------------------------------------

const usage = makeScriptUsage({
  description: `Bulk add screening room videos`,
  usageParams: `PROJECT_ID VENUE_ID SCREENING_VIDEOS_CSV_PATH CREDENTIAL_PATH`,
  exampleParams: `co-reality-sparkle bootstrap data.csv fooAccountKey.json`,
});

const [
  projectId,
  venueId,
  screeningVideosDataPath,
  credentialPath,
] = process.argv.slice(2);

if (!projectId || !credentialPath || !venueId || !screeningVideosDataPath) {
  usage();
}

if (!checkFileExists(credentialPath)) {
  console.error("Credential file path does not exists:", credentialPath);
  process.exit(1);
}

if (!checkFileExists(screeningVideosDataPath)) {
  console.error(
    "Data file file path does not exists:",
    screeningVideosDataPath
  );
  process.exit(1);
}

const app = initFirebaseAdminApp(projectId, { credentialPath });

const appBatch = app.firestore().batch();

(async () => {
  const screeningRoomVideosData = fs
    .readFileSync(screeningVideosDataPath, "utf-8")
    .split(/\r?\n/)
    .map((line) => line.split(","));

  // Remove the namings row
  screeningRoomVideosData.shift();

  screeningRoomVideosData.forEach((videoData) => {
    const screeningVideoRef = app
      .firestore()
      .collection("venues")
      .doc(venueId)
      .collection("screeningVideos")
      .doc();

    const [
      title,
      authorName,
      videoSrc,
      thumbnailSrc,
      category,
      subCategory,
      introduction,
    ] = videoData;

    const screeningRoomVideo: ScreeningRoomVideo = {
      title,
      authorName,
      videoSrc,
      thumbnailSrc,
      category: category.toLowerCase(),
      subCategory: subCategory.toLowerCase(),
      introduction,
    };

    appBatch.set(screeningVideoRef, screeningRoomVideo);
  });

  await appBatch.commit();

  console.log(
    `Succesfully added ${screeningRoomVideosData.length} videos to the ${venueId} venue.`
  );
})();
