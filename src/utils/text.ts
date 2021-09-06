/**
 * Split the provided string by spaces (ignoring spaces within "quoted text") into an array of tokens.
 *
 * @param string
 *
 * @see https://stackoverflow.com/a/16261693/1265472
 */
export const tokeniseStringWithQuotesBySpaces = (string: string): string[] =>
  string.match(/("[^"]*?"|[^"\s]+)+(?=\s*|\s*$)/g) ?? [];
