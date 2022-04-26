#!/usr/bin/env node -r esm -r ts-node/register

// Add isHidden to the venue collection

import { MigrateOptions } from "fireway";

export const migrate = async ({ firestore }: MigrateOptions) => {
  console.log(`Updating isHidden...`);

  const { docs: venueDocs } = await firestore.collection("venues").get();

  for (const venueDoc of venueDocs) {
    await venueDoc.ref.update({ isHidden: false });
  }

  console.log("Finished successfully.");
};
