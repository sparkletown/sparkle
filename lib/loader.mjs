// Ref: https://github.com/TypeStrong/ts-node/issues/1007#issuecomment-734659532
// support for extensionless files in "bin" scripts
export async function getFormat(url, context, defaultGetFormat) {
  const format = await defaultGetFormat(url, context, defaultGetFormat);
  if (!format.format) {
    format.format = 'commonjs';
  }
  return format;
}
