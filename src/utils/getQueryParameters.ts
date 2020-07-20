import qs from "qs";

const getQueryParameters = (search: string) =>
  qs.parse(search, { ignoreQueryPrefix: true });

export default getQueryParameters;
