import Bugsnag from "@bugsnag/js";
import { differenceInMinutes, getUnixTime, parseISO } from "date-fns";
import Papa, { ParseError, ParseMeta } from "papaparse";

import { VenueEvent, VenueEventWithVenueId } from "types/venues";

export type ParseData = Record<string, string>;

export enum ImportEventsCsvHeader {
  eventName = "Event Name",
  room = "Room Name",
  host = "Event Host Name",
  startDate = "Event Start",
  endDate = "Event End",
  description = "Event Description",
  venueId = "Venue ID",
}

export const parseCsv = (input: string | File) =>
  new Promise<{ meta: ParseMeta; data: ParseData[] }>((resolve, reject) =>
    Papa.parse(input, {
      download: input instanceof File,
      header: true,
      worker: true,
      skipEmptyLines: true,
      complete: ({
        data,
        errors,
        meta,
      }: {
        data: ParseData[];
        errors: ParseError[];
        meta: ParseMeta;
      }) => {
        if (errors?.length > 0) {
          Bugsnag.notify(new Error(errors.join("\n")), (event) => {
            event.severity = "info";
            event.addMetadata("utils::csv::parseCsv", { input });
          });
          reject(errors);
        } else {
          resolve({ meta, data });
        }
      },
    })
  );

export const transformImportToEvents: (
  imported: ParseData[]
) => VenueEventWithVenueId[] = (imported) =>
  imported.map((item) => {
    const eventName = item[ImportEventsCsvHeader.eventName];
    const room = item[ImportEventsCsvHeader.room];
    const host = item[ImportEventsCsvHeader.host];
    const startDate = parseISO(item[ImportEventsCsvHeader.startDate]);
    const endDate = parseISO(item[ImportEventsCsvHeader.endDate]);
    const description = item[ImportEventsCsvHeader.description];
    const venueId = item[ImportEventsCsvHeader.venueId];

    const duration = differenceInMinutes(endDate, startDate);
    const unixTime = getUnixTime(startDate);

    const event: VenueEvent = {
      name: eventName,
      duration_minutes: duration,
      start_utc_seconds: unixTime,
      description: description,
      host: host,
    };

    // NOTE: previous check used to be room !== "-1", but empty string is also possible in CSV
    if (room) {
      event.room = room;
    }

    return { event, venueId };
  });
