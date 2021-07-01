import {
  checkFileExists,
  initFirebaseAdminApp,
  makeScriptUsage,
  parseCredentialFile,
} from "../lib/helpers";

import { eventsFromCSVFile } from "../../src/utils/event";
import { VenueEvent } from "../../src/types/venues";

const usage = makeScriptUsage({
  description: "Bulk upload events from a spreadsheet ",
  usageParams: "PROJECT_ID FILE CREDENTIAL_PATH",
  exampleParams: "co-reality-map test.csv fooAccountKey.json",
});

const [projectId, filePath, credentialPath] = process.argv.slice(2);

if (!credentialPath || !filePath) {
  usage();
}

if (!checkFileExists(credentialPath)) {
  console.error("Credential file path does not exists:", credentialPath);
  process.exit(1);
}

const { project_id: projectIdCredentialFile } = parseCredentialFile(
  credentialPath
);

if (projectId !== projectIdCredentialFile) {
  console.error(
    "Project_Id is not the same with project_Id in credential file"
  );
  process.exit(1);
}

const app = initFirebaseAdminApp(projectIdCredentialFile, { credentialPath });

type eventWithVenueId = {
  event: VenueEvent;
  venueId: string;
};

(async () => {
  const events = await eventsFromCSVFile(filePath);
  if (events) {
    events.map(async (event: eventWithVenueId) => {
      await app
        .firestore()
        .collection(`venues/${event.venueId}/events`)
        .add(event.event);
    });
  }
})();
