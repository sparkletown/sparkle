#!/usr/bin/env node -r esm -r ts-node/register

import { ScreeningRoomVideo } from "../src/types/screeningRoom";

import {
  checkFileExists,
  initFirebaseAdminApp,
  makeScriptUsage,
} from "./lib/helpers";

const usage = makeScriptUsage({
  description: `Bulk add screening room videos`,
  usageParams: `PROJECT_ID VENUE_ID SCREENING_VIDEOS_CSV_PATH CREDENTIAL_PATH`,
  exampleParams: `co-reality-sparkle bootstrap fooAccountKey.json`,
});

const [
  projectId,
  venueId,
  credentialPath,
] = process.argv.slice(2);

if (!projectId || !credentialPath || !venueId ||) {
  usage();
}

if (!checkFileExists(credentialPath)) {
  console.error("Credential file path does not exists:", credentialPath);
  process.exit(1);
}

const app = initFirebaseAdminApp(projectId, { credentialPath });

const appBatch = app.firestore().batch();

(async () => {
  const screeningRoomVideosData =

  screeningRoomVideosData.forEach((videoData) => {
    const screeningVideoRef = app
      .firestore()
      .collection("venues")
      .doc(venueId)
      .collection("screeningRoomVideos")
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
      ...(subCategory ? { subCategory: subCategory.toLowerCase() } : {}),
      ...(introduction ? { introduction } : {}),
    };

    console.log(screeningRoomVideo);

    appBatch.set(screeningVideoRef, screeningRoomVideo);
  });

  await appBatch.commit();

  console.log(
    `Succesfully added ${screeningRoomVideosData.length} videos to the ${venueId} venue.`
  );
})();
