import { differenceInYears, parseISO } from "date-fns";

const ID_TAIL_LENGTH = 6;

export const generateId: (prefix: string) => string = (prefix) =>
  `${prefix}-${Date.now()}-${Math.trunc(Math.random() * 10 ** ID_TAIL_LENGTH)}`;

export const validateDateOfBirth: (stringDate: string) => boolean = (
  stringDate
) => {
  const yearsDifference = differenceInYears(new Date(), parseISO(stringDate));
  const result = yearsDifference >= 18 && yearsDifference <= 100;
  return result;
};

export type DateOfBirthInfo = {
  day: string;
  month: string;
  year: string;
};

export const validateDateOfBirthInfo: (values: DateOfBirthInfo) => boolean = (
  info
) => {
  const now = new Date();
  const dob = new Date(`${info.year}-${info.month}-${info.day}`);
  const difference = differenceInYears(now, dob);
  return Number.isSafeInteger(difference) && difference >= 18;
};
