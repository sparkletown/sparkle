import React from "react";
import { useParams } from "react-router";

import { CurrentStyles } from "pages/StylePoC/CurrentStyles";

const SUB: Readonly<Record<string, React.FC>> = Object.freeze({
  current: CurrentStyles,
});

export const StylePoC: React.FC = () => {
  const { version } = useParams<{ version?: string }>();
  const Selected: React.FC | null = SUB[`${version}`];

  return Selected ? <Selected /> : null;
};
