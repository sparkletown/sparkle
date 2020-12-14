import { writeFileSync } from "fs";

import admin from "firebase-admin";
import formatDate from "date-fns/format/index.js";
import { resolve } from "path";

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

export const initFirebaseAdminApp = (
  projectId: string,
  {
    appName,
    credentialPath = resolve(__dirname, "../prodAccountKey.json"),
  }: { appName?: string; credentialPath?: string }
) =>
  admin.initializeApp(
    {
      projectId,
      credential: admin.credential.cert(credentialPath),
      storageBucket: `${projectId}.appspot.com`,
    },
    appName
  );
