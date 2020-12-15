#!/usr/bin/env node -r esm -r ts-node/register

import admin from "firebase-admin";

import { initFirebaseAdminApp } from "./lib/helpers";

const usage = () => {
  const scriptName = process.argv[1];
  const helpText = `
---------------------------------------------------------
${scriptName}: Count documents at the second level of a Firestore collection.

Usage: node ${scriptName} PROJECT_ID

Example: node ${scriptName} co-reality-map
---------------------------------------------------------
`;

  console.log(helpText);
  process.exit(1);
};

const [projectId, collection] = process.argv.slice(2);
if (!projectId) {
  usage();
}

initFirebaseAdminApp(projectId);

(async () => {
  const topLevelDocs = await admin
    .firestore()
    .collection(collection)
    .listDocuments();
  console.log(`number of documents in ${collection}:`, topLevelDocs.length);
  let totalSecondLevelDocs = 0;
  await Promise.all(
    topLevelDocs.map(async (topLevelDoc) => {
      await Promise.all(
        (await topLevelDoc.listCollections()).map(async (collection) => {
          const secondLevelDocs = await collection.listDocuments();
          const count = secondLevelDocs.length;
          console.log("collection:", topLevelDoc.id, "has N docs:", count);
          totalSecondLevelDocs += count;
        })
      );
    })
  );
  console.log("total documents: ", totalSecondLevelDocs);
})();
