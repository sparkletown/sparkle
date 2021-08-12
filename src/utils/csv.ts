import Bugsnag from "@bugsnag/js";
import Papa, { ParseError, ParseMeta } from "papaparse";

export const parseCsv = (input: string | File) =>
  new Promise<{ meta: ParseMeta; data: Record<string, string>[] }>(
    (resolve, reject) =>
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
          data: Record<string, string>[];
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
