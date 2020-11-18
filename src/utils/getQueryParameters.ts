import qs from "qs";

export const getQueryParameters = (search: string) =>
  qs.parse(search, { ignoreQueryPrefix: true });

/**
 * @deprecated use named export instead
 */
export default getQueryParameters;
