import { existsSync, readFileSync, writeFileSync } from "fs";

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
): admin.app.App =>
  admin.initializeApp(
    {
      projectId,
      credential: admin.credential.cert(credentialPath),
      storageBucket: `${projectId}.appspot.com`,
    },
    appName
  );

export const checkFileExists = (path: string) => existsSync(path);

interface CredentialFile {
  type?: string;
  project_id?: string;
  private_key_id?: string;
  private_key?: string;
  client_email?: string;
  client_id?: string;
  auth_uri?: string;
  token_uri?: string;
  auth_provider_x509_cert_url?: string;
  client_x509_cert_url?: string;
}

export const parseCredentialFile = (
  credentialPath = resolve(__dirname, "../prodAccountKey.json")
): CredentialFile => JSON.parse(readFileSync(credentialPath, "utf8"));

export const findUserByEmail = (app: admin.app.App) => (
  email: string
): Promise<admin.auth.UserRecord | undefined> =>
  app
    .auth()
    .getUserByEmail(email)
    .catch(() => undefined);
