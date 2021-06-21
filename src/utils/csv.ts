import * as fs from "fs";
import neatCsv from "neat-csv";

export const getCSVRows = async (filePath: string) => {
  let results: Array<Object> = [];
  let file = await fs.createReadStream(filePath);
  // console.log(await neatCsv(file));
  results = await neatCsv(file);
  return results;
  // .pipe(csv())
  // .on('data', (data) => results.push(data))
  // .on('end', () => {
  //   return results
  // });
};
