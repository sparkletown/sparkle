export const breakStringWithQuotesBySpaces = (string: string) =>
  string.match(/("[^"]*?"|[^"\s]+)+(?=\s*|\s*$)/g); // source: https://stackoverflow.com/a/16261693/1265472
