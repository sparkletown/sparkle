#!/usr/bin/env ts-node

import {
  checkFileExists,
  initFirebaseAdminApp,
  makeScriptUsage,
} from "./lib/helpers";
import { DocumentData, QueryDocumentSnapshot } from "./lib/types";

const usage = makeScriptUsage({
  description:
    "Make the given user ID an owner on all spaces in the given world",
  usageParams: "PROJECT_ID WORLD_ID USER_ID [CREDENTIAL_PATH]",
  exampleParams:
    "co-reality-staging ABC123 DEF567 co-reality-staging-30f7b0b5de9a.json",
});

const [projectId, worldId, userId, credentialPath] = process.argv.slice(2);

// Note: no need to check credentialPath here as initFirebaseAdmin defaults it when undefined
if (!projectId || !worldId || !userId || !credentialPath) {
  usage();
  process.exit(1);
}

if (!checkFileExists(credentialPath)) {
  console.error("Credential file path does not exists:", credentialPath);
  process.exit(1);
}

process.on("SIGINT", () => {
  process.exit(1);
});

const app = initFirebaseAdminApp(projectId, { credentialPath });

(async () => {
  console.log("Adding to world owners");
  const worldDoc = await app
    .firestore()
    .collection("worlds")
    .doc(worldId)
    .get();
  const worldData = worldDoc.data();
  worldData.owners.push(userId);
  worldDoc.ref.update({
    owners: worldData.owners,
  });

  const { docs: spaceDocs } = await app
    .firestore()
    .collection("venues")
    .where("worldId", "==", worldId)
    .get();

  console.log(`Found ${spaceDocs.length} spaces to update`);

  await Promise.all(
    spaceDocs.map(async (spaceDoc: QueryDocumentSnapshot<DocumentData>) => {
      const spaceData = spaceDoc.data();
      if (spaceData.owners.findIndex((owner) => owner === userId) !== -1) {
        console.log(`Skipping space ${spaceDoc.id}`);
        return;
      }
      spaceData.owners.push(userId);

      console.log(`Updating space ${spaceDoc.id}`);
      await spaceDoc.ref.update({
        owners: spaceData.owners,
      });
    })
  );
})();
