import React, { useCallback, useState } from "react";
import { AdminRestrictedLoading } from "components/admin/AdminRestrictedLoading";
import { AdminRestrictedMessage } from "components/admin/AdminRestrictedMessage";
import { Button } from "components/admin/Button";
import { Header } from "components/admin/Header";
import { SectionHeading } from "components/admin/SectionHeading";
import { SectionTitle } from "components/admin/SectionTitle";
import { AdminLayout } from "components/layouts/AdminLayout";
import { FullWidthLayout } from "components/layouts/FullWidthLayout";
import { WithPermission } from "components/shared/WithPermission";

import { useWorldParams } from "hooks/worlds/useWorldParams";

import { Tool } from "./components/Tool";
import * as tools from "./scripts";
import { SelfServeScript } from "./types";

export const ToolsPage: React.FC = () => {
  const [chosenTool, setChosenTool] = useState<SelfServeScript>();

  const clearChosenTool = useCallback(() => setChosenTool(undefined), []);

  const { worldSlug } = useWorldParams();

  return (
    <AdminLayout>
      <div className="ToolsPage">
        <WithPermission
          check="world"
          loading={<AdminRestrictedLoading />}
          fallback={<AdminRestrictedMessage />}
        >
          <Header title="Reports" />
          {chosenTool ? (
            <>
              <div className="Tools__back">
                <Button onClick={clearChosenTool}>Back to Tools</Button>
              </div>
              <Tool tool={chosenTool} worldSlug={worldSlug} />
            </>
          ) : (
            <FullWidthLayout>
              <SectionHeading>
                <SectionTitle>Tools</SectionTitle>
              </SectionHeading>

              {Object.values(tools).map((tool) => (
                <Button
                  key={`${tool.name}-${tool.functionLocation}`}
                  onClick={() => setChosenTool(tool)}
                  borders="rounded"
                >
                  {tool.name}
                </Button>
              ))}
            </FullWidthLayout>
          )}
        </WithPermission>
      </div>
    </AdminLayout>
  );
};
