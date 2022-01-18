import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useAsyncFn } from "react-use";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import firebase from "firebase/app";

import { ADMIN_IA_WORLD_PARAM_URL } from "settings";

import { generateUrl } from "utils/url";

import { useWorldParams } from "hooks/worlds/useWorldParams";

import WithNavigationBar from "components/organisms/WithNavigationBar";

import { Loading } from "components/molecules/Loading";

import { ButtonNG } from "components/atoms/ButtonNG";
import { InputField } from "components/atoms/InputField";

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
            <Tool tool={chosenTool} />
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

export const Tool: React.FC<{ tool: SelfServeScript }> = ({ tool }) => {
  const { register, handleSubmit, errors } = useForm();

  const [returnedData, setReturnedData] = useState<{ [key: string]: string }>();

  const [{ loading: isLoading }, onSubmit] = useAsyncFn(
    async (data: Object) => {
      const response = await firebase
        .functions()
        .httpsCallable(tool.functionLocation)(data);

      setReturnedData(response.data);
    },
    [tool.functionLocation]
  );

  if (returnedData) {
    return <tool.outputComponent {...returnedData} />;
  }

  return isLoading ? (
    <Loading />
  ) : (
    <form className="Tool" onSubmit={handleSubmit(onSubmit)}>
      {tool.arguments.map((argument) => (
        <div key={argument.name} className="Tool__input">
          <span className="Tool__input-label">{argument.title}</span>
          <InputField
            ref={register({ required: argument.isRequired })}
            name={argument.name}
            error={errors[argument.name]}
          />
        </div>
      ))}

      <ButtonNG type="submit">Run the tool</ButtonNG>
    </form>
  );
};
