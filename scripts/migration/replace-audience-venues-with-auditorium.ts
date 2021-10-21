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

initFirebaseAdminApp(projectId, {
  credentialPath: credentialPath ? resolve(credentialPath) : undefined,
});

(async () => {
  const { docs: venueDocs } = await admin
    .firestore()
    .collection("venues")
    .where("template", "==", "audience")
    .get();

  venueDocs.forEach(async (venueDoc) => {
    const destVenueSectionRef = venueDoc.ref.collection("sections").doc();
    destVenueSectionRef.set({ isVip: false });

    venueDoc.ref.update({ template: "auditorium" });
  });

  console.log(
    "Successfully transormed the following venues to auditorium:",
    venueDocs.map((doc) => doc.id)
  );
})();
