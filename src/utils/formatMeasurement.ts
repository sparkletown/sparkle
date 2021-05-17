export const formatMeasurement = (value: number, measureUnit: string) => {
  const baseFormatted = `${value} ${measureUnit}`;

  if (value === 0) return "";
  if (value === 1) return baseFormatted;
  if (value > 1) return `${baseFormatted}s`;
};
