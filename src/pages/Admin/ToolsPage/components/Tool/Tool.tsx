import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAsyncFn } from "react-use";
import { FIREBASE } from "core/firebase";
import { httpsCallable } from "firebase/functions";

import { Loading } from "components/molecules/Loading";

import { ButtonNG } from "components/atoms/ButtonNG";
import { InputField } from "components/atoms/InputField";

import { SelfServeScript } from "../../types";

import "./Tool.scss";

type ReturnedDataProps = { [key: string]: string };
export const Tool: React.FC<{ tool: SelfServeScript }> = ({ tool }) => {
  const { register, handleSubmit, errors } = useForm();

  const [returnedData, setReturnedData] = useState<ReturnedDataProps>();

  const [{ loading: isLoading }, onSubmit] = useAsyncFn(
    async (data: Object) => {
      const response = await httpsCallable<Object, ReturnedDataProps>(
        FIREBASE.functions,
        tool.functionLocation
      )(data);

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
