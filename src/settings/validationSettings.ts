export const COMMON_NAME_MAX_CHAR_COUNT = 50;
export const COMMON_NAME_MIN_CHAR_COUNT = 3;

export const COMMON_STRING_MIN_CHAR_COUNT = 3;
export const COMMON_STRING_MIN_CHAR_COUNT_RE = new RegExp(
  `.{${COMMON_STRING_MIN_CHAR_COUNT},}`
);

export const START_DATE_FORMAT_RE = /\d{4}-\d{2}-\d{2}/;
