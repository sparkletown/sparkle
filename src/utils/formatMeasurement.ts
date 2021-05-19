export const formatMeasurement = (value: number, measureUnit: string) => {
  const baseFormatted = `${value} ${measureUnit}`;

  return value === 1 ? baseFormatted : `${baseFormatted}s`;
};
