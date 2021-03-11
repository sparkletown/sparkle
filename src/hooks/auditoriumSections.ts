import { AuditoriumSection } from "types/auditorium";

export const useAuditoriumSection = (
  sectionId?: string
): AuditoriumSection => ({
  name: "My section",
  id: "unique_id",
});

export const useAuditoriumSections = (
  venueId?: string
): AuditoriumSection[] => {
  return Array(10)
    .fill({ name: "Section" })
    .map((section, index) => ({ ...section, id: index }));
};
