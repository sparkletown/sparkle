import React from "react";
import { useParams } from "react-router";

import { useAuditoriumSection } from "hooks/auditoriumSections";

export interface SectionProps {}

export const Section: React.FC<SectionProps> = () => {
  // const { takeSeat, seatedUsers } = useSection(sectionId);
  const { sectionId } = useParams<{ sectionId?: string }>();

  const section = useAuditoriumSection(sectionId);

  if (!section) return <p>No such section was found</p>;

  return <div>SECTION FOUND!</div>;
};
