import { existsSync, readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

import admin from "firebase-admin";
import formatDate from "date-fns/format/index.js";

import { Table } from "../../src/types/Table";

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
  }: { appName?: string; credentialPath?: string } = {}
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

/**
 * Ensure the supplied projectId matches the projectId in the credential file,
 * or exit with an error if not.
 *
 * @param projectId the firebase project ID to be checked
 * @param credentialPath the firebase credential file to check against
 */
export const ensureProjectIdMatchesCredentialProjectId = (
  projectId: string,
  credentialPath: string
) => {
  const credentialData = parseCredentialFile(credentialPath);

  if (projectId !== credentialData.project_id) {
    console.error(
      "Error: projectId doesn't match credentialData.project_id, did you choose the right file?"
    );
    console.error("  projectId                 :", projectId);
    console.error("  credentialData.project_id :", credentialData.project_id);
    process.exit(1);
  }
};

export const findUserByEmail = (app: admin.app.App) => (
  email: string
): Promise<admin.auth.UserRecord | undefined> =>
  app
    .auth()
    .getUserByEmail(email)
    .catch(() => undefined);

/**
 * Generate an array of Table configs that can be used with Jazz Bar/similar.
 *
 * @param num number of tables to create
 * @param capacity how many people can sit at each table
 * @param rows how many rows will the seats be displayed across for each table
 * @param columns how many columns will the seats be displayed across for each table
 * @param titlePrefix what should the tables be called (will have the table number appended to it)
 * @param startFrom what number should we start from when generating table numbers in the title
 */
export const generateTables: (props: {
  num: number;
  capacity: number;
  rows?: number;
  columns?: number;
  titlePrefix?: string;
  startFrom?: number;
}) => Table[] = ({
  num,
  capacity,
  rows = 2,
  columns = 3,
  titlePrefix = "Table",
  startFrom = 0,
}) =>
  Array.from(Array(num)).map((_, idx) => {
    const tableNumber = startFrom + 1 + idx;

    return {
      title: `${titlePrefix} ${tableNumber}`,
      reference: `${titlePrefix} ${tableNumber}`,
      capacity,
      rows,
      columns,
    };
  });
