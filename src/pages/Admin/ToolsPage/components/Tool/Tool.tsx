import React, { useState } from "react";
import { useForm, useFormState } from "react-hook-form";
import { useAsyncFn } from "react-use";
import { Button } from "components/admin/Button";
import { Input } from "components/admin/Input";
import { InputGroup } from "components/admin/InputGroup";
import { ThreeColumnLayout } from "components/admin/ThreeColumnLayout";
import { FIREBASE } from "core/firebase";
import { httpsCallable } from "firebase/functions";

import { WorldSlug } from "types/id";

import { Loading } from "components/molecules/Loading";

import { SelfServeScript } from "../../types";

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
    return (
      <ThreeColumnLayout>
        <tool.outputComponent {...returnedData} />
      </ThreeColumnLayout>
    );
  }

  if (isLoading) return <Loading label="Loading..." />;

  return (
    <ThreeColumnLayout>
      <form className="Tool" onSubmit={handleSubmit(onSubmit)}>
        {tool.arguments.map((argument) => (
          <div key={argument.name} className="Tool__input">
            <InputGroup title={argument.title}>
              <Input
                register={register}
                rules={{ required: argument.isRequired }}
                name={argument.name}
                errors={errors}
              />
            </InputGroup>
          </div>
        ))}

        <Button type="submit">Run the tool</Button>
      </form>
    </ThreeColumnLayout>
  );
};
