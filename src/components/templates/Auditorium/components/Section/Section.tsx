import React from "react";

export interface SectionProps {
  sectionId: string;
}

export const Section: React.FC<SectionProps> = ({ sectionId }) => {
  const { takeSeat, seatedUsers } = useSection(sectionId);

  return <div />;
};
