type RowInterface = {
  [key: string]: string;
};

export const makeCSVContents = (rows: RowInterface[], headers: string[]) => {
  let results = "data:text/csv;charset=utf-8,";
  results += headers.join(",") + "\n";
  rows.map((row: RowInterface) => {
    headers.map((header) => {
      results += row[header] + ",";
      return "";
    });
    results += "\n";
    return "";
  });
  return results;
};

export const downloadGeneratedCSVFile = (
  rows: RowInterface[],
  headers: string[]
) => {
  const csvContent = makeCSVContents(rows, headers);
  console.log(csvContent);
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "users_" + new Date().getTime() + ".csv");
  document.body.appendChild(link);
  link.click();
};
