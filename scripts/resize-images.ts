/*
  To run:

  -
    - ensure accountKey has the correct service account data from firebase
    - ensure APP_PREFIX is set to co-reality-staging or co-reality-map
    - set BACKUP to true to backup all images from firebase (in logical directory structure)
    - set BACKUP to false to set resize all images to width COMPRESSION_WIDTH_PX and auto height

    once configured, in a terminal, run: npx ts-node resize-images.ts
*/

import admin from "firebase-admin";
import serviceAccount from "./prodAccountKey.json";
import { uuid } from "uuidv4";
import jimp from "jimp";
import fs from "fs";

const APP_PREFIX = "co-reality-map";
const COMPRESSION_WIDTH_PX = 600;
const BACKUP = true;
const ACCEPTED_MIME_TYPES = [
  "image/png",
  "image/jpg",
  "image/jpeg",
  "image/tiff",
  "image/bmp",
];

admin.initializeApp({
  credential: admin.credential.cert((serviceAccount as unknown) as string),
  databaseURL: `https://${APP_PREFIX}.firebaseio.com`,
  storageBucket: `${APP_PREFIX}.appspot.com`,
});

const backupFile = async (remotePath: string, signedUrl: string) => {
  const backuplocation = `./backup/${remotePath}`;

  if (fs.existsSync(backuplocation)) {
    console.log("file exists", backuplocation);
    return;
  }

  console.log("downloading", backuplocation);

  try {
    // errors if the image is malformed
    const jimpImage = await jimp.read(signedUrl);
    const backupDirectoryPath = backuplocation.replace(/[^\/]+$/, "");
    fs.mkdirSync(backupDirectoryPath, { recursive: true });
    return await jimpImage.writeAsync(backuplocation);
  } catch (e) {
    console.log(signedUrl);
    console.log(e);
    return;
  }
};

const main = async () => {
  const bucket = admin.storage().bucket();
  const res = await bucket.getFiles({ directory: "users" });
  const files = res[0];

  for (const file of files) {
    const [signedurl] = await file.getSignedUrl({
      action: "read",
      expires: "10-10-2020",
    });
    console.log("\n\n");

    if (!ACCEPTED_MIME_TYPES.includes(file.metadata.contentType)) {
      console.log(
        `Skipping - ${file.metadata.contentType} Not a processible file type`
      );
      continue;
    }

    if (BACKUP) {
      await backupFile(file.name, signedurl);
      continue;
    }

    const resizeImages = async () => {
      const jimpImage = await jimp.read(signedurl);

      if (file.name.endsWith("gif")) {
        console.log(`${file.name} is a gif. Skipping`);
        return;
      }

      // only resize if intrinsic width greater than compression width
      if (jimpImage.bitmap.width <= COMPRESSION_WIDTH_PX) {
        console.log(
          `Skipping ${file.name} - width is ${jimpImage.bitmap.width}, <= ${COMPRESSION_WIDTH_PX}`
        );
        return;
      } else {
        console.log(`${file.name} width is ${jimpImage.bitmap.width}`);
      }

      const filename = file.name.replace(/^.*[\\\/]/, "");
      const resizedFilePath = `./temp/${filename}`;

      jimpImage.resize(COMPRESSION_WIDTH_PX, jimp.AUTO);
      await jimpImage.writeAsync(resizedFilePath);

      await bucket.upload(resizedFilePath, {
        destination: file.name,
        metadata: {
          metadata: {
            firebaseStorageDownloadTokens: uuid(),
          },
        },
      });
      console.log(`***** Overwritten ${file.name}`);
      fs.unlinkSync(resizedFilePath);
    };

    try {
      await resizeImages();
    } catch (e) {
      console.log("Error", e);
    }
  }
};

main();
