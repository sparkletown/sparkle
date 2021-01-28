#!/usr/bin/env node -r esm -r ts-node/register

import { readFileSync } from "fs";
import { resolve } from "path";
import { exec } from "child_process";

const usage = () => {
  const scriptName = process.argv[1];
  const helpText = `
---------------------------------------------------------
Uploads service account credentials to firebase function config.

This is most useful when setting up a new environment for the first time. 

Usage: ${scriptName} PROJECT_ID CREDENTIAL_PATH

Example: ${scriptName} sparkle-example TODO-PROJECT-ID-firebase-adminsdk-abc12-1234567890.json
---------------------------------------------------------
`;

  console.log(helpText);
  process.exit(1);
};

const [projectId, credentialPath] = process.argv.slice(2);
if (!projectId || !credentialPath) {
  usage();
}

const resolvedCredentialPath = resolve(credentialPath);
const credentialJson = readFileSync(resolvedCredentialPath, "utf8");
const credentialData = JSON.parse(credentialJson);

if (projectId !== credentialData.project_id) {
  console.error(
    "Error: projectId doesn't match credentialData.project_id, did you choose the right file?"
  );
  console.error("  projectId                 :", projectId);
  console.error("  credentialData.project_id :", credentialData.project_id);
  process.exit(1);
}

const configItems = Object.entries(credentialData).map(
  ([key, value]) => `service_account.${key}='${value}'`
);
const configItemsString = configItems.join(" ");

const cmd = `npx firebase --project ${projectId} functions:config:set ${configItemsString}`;

const proc = exec(cmd, (err, stdout) => {
  console.log(stdout);
});

proc.on("close", () => {
  console.log(
    `You can check the full config by running: npx firebase --project ${projectId} functions:config:get`
  );
});
