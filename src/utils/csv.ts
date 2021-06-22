import * as fs from "fs";
import neatCsv from "neat-csv";

export const getCSVRows = async (filePath: string) => {
  let results: Array<Object> = [];
  let file = await fs.createReadStream(filePath);
  results = await neatCsv(file);
  return results;
};
