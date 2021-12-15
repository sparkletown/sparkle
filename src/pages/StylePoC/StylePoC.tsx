import React from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";

import { RND_STYLE_POC } from "settings";

import { generateUrl } from "utils/url";

import { StyleShowCurrent } from "./StyleShowCurrent";
import { StyleShowModule } from "./StyleShowModule";
import { StyleShowTailwind } from "./StyleShowTailwind";

import "./StylePoC.scss";

const SUB: Readonly<Record<string, React.FC>> = Object.freeze({
  current: StyleShowCurrent,
  modules: StyleShowModule,
  tailwind: StyleShowTailwind,
});

export const StylePoC: React.FC = () => {
  const { version } = useParams<{ version?: string }>();
  const Selected: React.FC | null = SUB[`${version}`];

  return (
    <div className="StylePoC">
      <nav className="StylePoC__nav">
        {Object.keys(SUB).map((version) => (
          <Link
            key={version}
            to={generateUrl({
              route: RND_STYLE_POC,
              params: { version },
            })}
          >
            {version}
          </Link>
        ))}
      </nav>
      <main className="StylePoC__main">{Selected && <Selected />}</main>
    </div>
  );
};
