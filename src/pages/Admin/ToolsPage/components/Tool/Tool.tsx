import React, { useState } from "react";
import { useForm, useFormState } from "react-hook-form";
import { useAsyncFn } from "react-use";
import { FIREBASE } from "core/firebase";
import { httpsCallable } from "firebase/functions";

import { WorldSlug } from "types/id";

import { ButtonNG } from "components/atoms/ButtonNG";
import { InputField } from "components/atoms/InputField";
import { Loading } from "components/molecules/Loading";

import { SelfServeScript } from "../../types";

import "./Tool.scss";

type ToolOptions = {
  tool: SelfServeScript;
  worldSlug?: WorldSlug;
};

type ReturnedDataProps = { [key: string]: string };

export const Tool: React.FC<ToolOptions> = ({ tool, worldSlug }) => {
  const { register, handleSubmit, control } = useForm();
  const { errors } = useFormState({ control });

  const [returnedData, setReturnedData] = useState<ReturnedDataProps>();

  const [{ loading: isLoading }, onSubmit] = useAsyncFn(
    async (data: Object) => {
      if (!worldSlug) return;

      const response = await httpsCallable<Object, ReturnedDataProps>(
        FIREBASE.functions,
        tool.functionLocation
      )({ worldSlug, ...data });

      setReturnedData(response.data);
    },
    [tool.functionLocation, worldSlug]
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
            register={register}
            rules={{ required: argument.isRequired }}
            name={argument.name}
            error={errors[argument.name]}
          />
        </div>
      ))}

      <ButtonNG type="submit">Run the tool</ButtonNG>
    </form>
  );
};
