#!/usr/bin/env node -r esm -r ts-node/register

import { MigrateOptions } from "fireway";

export const migrate = async ({ firestore }: MigrateOptions) => {
  console.log(`Updating worlds...`);

  const { docs: worldDocs } = await firestore.collection("worlds").get();

  for (const worldDoc of worldDocs) {
    if ("isHidden" in worldDoc.data()) {
      console.log(`Skipping ${worldDoc.id}`);
      continue;
    }
    await worldDoc.ref.update({ isHidden: false });
  }

  console.log("Finished successfully.");
};
