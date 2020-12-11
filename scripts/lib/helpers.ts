import { writeFileSync } from "fs";

import admin from "firebase-admin";
import formatDate from "date-fns/format/index.js";

import serviceAccount from "../prodAccountKey.json";

export const makeSaveToBackupFile = (filenamePrefix: string) => (
  data: string | {} | [],
  type: string = "general",
  ext: string = "backup.json"
) => {
  const backupDate = formatDate(new Date(), "yyyyMMdd-HHmmss");
  const backupFilename = `${backupDate}-${filenamePrefix}-${type}.${ext}`;

  const jsonData = JSON.stringify(data, null, 2);

  writeFileSync(backupFilename, jsonData, "utf8");

  console.log(`Saved backup (type='${type}') to ${backupFilename}`);
};

export const initFirebaseAdminApp = (projectId: string, appName?: string) =>
  admin.initializeApp(
    {
      credential: admin.credential.cert((serviceAccount as unknown) as string),
      databaseURL: `https://${projectId}.firebaseio.com`,
      storageBucket: `${projectId}.appspot.com`,
    },
    appName
  );
