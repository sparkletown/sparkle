#!/usr/bin/env node -r esm -r ts-node/register

import { v4 as uuidv4 } from "uuid";

import {
  checkFileExists,
  findUserByEmail,
  initFirebaseAdminApp,
  parseCredentialFile,
} from "./lib/helpers";

// ---------------------------------------------------------
// Configuration (this is the bit you should edit)
// ---------------------------------------------------------

const EMAIL_ADDRESSES: string[] = [];

// ---------------------------------------------------------
// HERE THERE BE DRAGONS (edit below here at your own risk)
// ---------------------------------------------------------

const usage = () => {
  const scriptName = process.argv[1];
  const helpText = `
---------------------------------------------------------  
${scriptName}: Bulk register users based on the supplied email address(es)

Usage: node ${scriptName} CREDENTIAL_FILE EMAIL1 EMAIL2 EMAIlN...

Example: node ${scriptName} fooAccountKey.json foouser@example.com baruser@example.com
---------------------------------------------------------
`;

  console.log(helpText);
  process.exit(1);
};

const [credentialPath, ...extraEmailAddresses] = process.argv.slice(2);
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

const app = initFirebaseAdminApp(projectId, { credentialPath });

(async () => {
  const allEmailAddresses = [...EMAIL_ADDRESSES, ...extraEmailAddresses];

  for (const email of allEmailAddresses) {
    const existingUser = await findUserByEmail(app)(email);

    if (existingUser) {
      console.warn(`User already exists for ${email}, skipping..`);
      continue;
    }

    const password = uuidv4();

    await app.auth().createUser({ email, password });

    console.log(`User created: email=${email}, password=${password}`);
  }
})();
