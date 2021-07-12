import { writeToString } from "@fast-csv/format";

type RowInterface = {
  [key: string]: string;
};

const getCSVRows = (rows: readonly RowInterface[]) => {
  let results: RowInterface[] = [];
  rows.map((row: RowInterface) => {
    results.push(row);
    return "";
  });
  return results;
};

export const downloadGeneratedCSVFile = async (
  // Rows needed to be normal objects but as input type is WithId<User> I can not pass it to @fast-csv/format lib so I need to use any
  // eslint-disable-next-line
  rows: readonly any[],
  headers: string[]
) => {
  const csvContent = await writeToString(getCSVRows(rows), {
    headers: headers,
    quote: true,
  });
  const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute(
    "download",
    "users_report_" + new Date().getTime() + ".csv"
  );
  document.body.appendChild(link);
  link.click();
};
