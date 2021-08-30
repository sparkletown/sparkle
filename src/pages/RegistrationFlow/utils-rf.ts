import { differenceInYears, parseISO } from "date-fns";

const ID_TAIL_LENGTH = 6;

export const generateId: (prefix: string) => string = (prefix) =>
  `${prefix}-${Date.now()}-${Math.trunc(Math.random() * 10 ** ID_TAIL_LENGTH)}`;

export const validateDateOfBirth: (stringDate: string) => boolean = (
  stringDate
) => {
  const yearsDifference = differenceInYears(new Date(), parseISO(stringDate));
  return yearsDifference >= 18 && yearsDifference <= 100;
};
