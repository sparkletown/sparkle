/**
 * Split the provided string by spaces (ignoring spaces within "quoted text") into an array of tokens.
 *
 * @param string
 *
 * @see https://stackoverflow.com/a/16261693/1265472
 *
 * @debt Depending on the outcome of https://github.com/github/codeql/issues/5964 we may end up needing to change
 *   this regex for performance reasons.
 */
export const tokeniseStringWithQuotesBySpaces = (string: string): string[] =>
  string.match(/("[^"]*?"|[^"\s]+)+(?=\s*|\s*$)/g) ?? [];
