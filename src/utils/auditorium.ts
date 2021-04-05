import { AuditoriumSize } from "types/auditorium";

export interface TranslateIndexProps {
  index: number;
  totalAmount: number;
}

export const translateIndex = ({ index, totalAmount }: TranslateIndexProps) =>
  index - Math.floor(totalAmount / 2);

export const chooseAuditoriumSize = (sectionsCount: number) => {
  if (sectionsCount <= 4) return AuditoriumSize.SMALL;

  if (sectionsCount > 4 && sectionsCount <= 10) {
    return AuditoriumSize.MEDIUM;
  }

  return AuditoriumSize.LARGE;
};
