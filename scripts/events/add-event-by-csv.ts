#!/usr/bin/env node -r esm -r ts-node/register

import {
  checkFileExists,
  initFirebaseAdminApp,
  makeScriptUsage,
  parseCredentialFile,
} from "../lib/helpers";

import { VenueEvent } from "../../src/types/venues";
import { getDurationMinutes, getUTCStartTime } from "../../src/utils/time";
import { getCSVRows } from "../../src/utils/csv";

type rawEventsOptions = {
  // eslint-disable-next-line
  [key: string]: any;
};

const usage = makeScriptUsage({
  description: "Bulk upload events from a spreadsheet ",
  usageParams: "CREDENTIAL_PATH FILE",
  exampleParams: "fooAccountKey.json test.csv",
});

const [credentialPath, filePath] = process.argv.slice(2);

if (!credentialPath || !filePath) {
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

const csvHeaders = {
  eventName: "Event Name",
  room: "Room Name",
  host: "Event Host Name",
  startDate: "Event Start",
  endDate: "Event End",
  description: "Event Description",
  venueId: "Venue ID",
};

(async () => {
  let results = await getCSVRows(filePath);
  results.forEach(async (rawEvent: rawEventsOptions) => {
    const event: VenueEvent = {
      name: rawEvent[csvHeaders.eventName],
      duration_minutes: getDurationMinutes(
        rawEvent[csvHeaders.startDate],
        rawEvent[csvHeaders.endDate]
      ),
      start_utc_seconds: getUTCStartTime(rawEvent[csvHeaders.startDate]),
      description: rawEvent[csvHeaders.description],
      price: 0,
      collective_price: 0,
      host: rawEvent[csvHeaders.host],
    };
    if (rawEvent[csvHeaders.room] !== "-1") {
      event.room = rawEvent[csvHeaders.room];
    }
    await app
      .firestore()
      .collection(`venues/${rawEvent[csvHeaders.venueId]}/events`)
      .add(event);
  });
})();
