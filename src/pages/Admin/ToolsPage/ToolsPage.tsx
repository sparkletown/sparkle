import React, { useCallback, useState } from "react";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import { ADMIN_IA_WORLD_PARAM_URL } from "settings";

import { generateUrl } from "utils/url";

import { useWorldParams } from "hooks/worlds/useWorldParams";

import { ButtonNG } from "components/atoms/ButtonNG";
import { WithNavigationBar } from "components/organisms/WithNavigationBar";

import { Tool } from "./components/Tool";
import * as tools from "./scripts";
import { SelfServeScript } from "./types";

import "./ToolsPage.scss";

export const ToolsPage: React.FC = () => {
  const [chosenTool, setChosenTool] = useState<SelfServeScript>();

  const clearChosenTool = useCallback(() => setChosenTool(undefined), []);

  const { worldSlug } = useWorldParams();

  return (
    <WithNavigationBar>
      <div className="ToolsPage">
        {chosenTool ? (
          <>
            <div className="Tools__back">
              <ButtonNG onClick={clearChosenTool} iconName={faArrowLeft}>
                Back to Tools
              </ButtonNG>
            </div>
            <Tool tool={chosenTool} worldSlug={worldSlug} />
          </>
        ) : (
          <>
            <div className="Tools__back">
              <ButtonNG
                isLink
                linkTo={generateUrl({
                  route: ADMIN_IA_WORLD_PARAM_URL,
                  required: ["worldSlug"],
                  params: { worldSlug },
                })}
                iconName={faArrowLeft}
              >
                Back to Dashboard
              </ButtonNG>
            </div>
            {Object.values(tools).map((tool) => (
              <ButtonNG
                key={`${tool.name}-${tool.functionLocation}`}
                onClick={() => setChosenTool(tool)}
                variant="secondary"
              >
                {tool.name}
              </ButtonNG>
            ))}
          </>
        )}
      </div>
    </WithNavigationBar>
  );
};
