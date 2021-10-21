#!/usr/bin/env node -r esm -r ts-node/register

import { resolve } from "path";

import admin from "firebase-admin";

import {
  checkFileExists,
  initFirebaseAdminApp,
  makeScriptUsage,
  parseCredentialFile,
} from "../lib/helpers";

const usage = makeScriptUsage({
  description:
    "Transforms all the audiences to auditoriums creating a section in them",
  usageParams: "[CREDENTIAL_PATH]",
  exampleParams: "[theMatchingAccountServiceKey.json]",
});

const [credentialPath] = process.argv.slice(2);

if (!credentialPath || !checkFileExists(credentialPath)) {
  console.error("Credential file path does not exists:", credentialPath);
  usage();
}

const { project_id: projectId } = parseCredentialFile(credentialPath);

if (!projectId) {
  console.error("Invalid credential file: there is no project id.");
  usage();
  process.exit(1);
}

const app = initFirebaseAdminApp(projectId, {
  credentialPath: credentialPath ? resolve(credentialPath) : undefined,
});

const appBatch = app.firestore().batch();

(async () => {
  const venuesCollection = admin
    .firestore()
    .collection("venues")
    .where("template", "==", "audience");
  const venueDocs = (await venuesCollection.get()).docs;

  await venueDocs.forEach(async (venueDoc) => {
    const destVenueSectionRef = venueDoc.ref.collection("sections").doc();
    appBatch.set(destVenueSectionRef, { isVip: false });

    appBatch.update(venueDoc.ref, { template: "auditorium" });
  });

  await appBatch.commit();

  console.log(
    "Successfully transormed the following venues to auditorium:",
    venueDocs.map((doc) => doc.id)
  );
})();
