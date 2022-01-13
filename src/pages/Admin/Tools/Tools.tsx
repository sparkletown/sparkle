import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAsyncFn } from "react-use";
import firebase from "firebase/app";

import * as scripts from "./scripts";
import { SelfServeScript } from "./types";

export const Tools: React.FC = () => {
  const [chosenScript, setChosenScript] = useState<SelfServeScript>();

  return (
    <div>
      {chosenScript ? (
        <div>Script element</div>
      ) : (
        Object.values(scripts).map((script) => (
          <div
            onClick={() => setChosenScript(script)}
            key={`${script.name}-${script.functionLocation}`}
          >
            {script.name}
          </div>
        ))
      )}
    </div>
  );
};

export const Script: React.FC<{ script: SelfServeScript }> = ({ script }) => {
  const { register, handleSubmit } = useForm();

  const [{ loading: isRunning, value }, runScript] = useAsyncFn(
    async (data) => {
      return firebase.functions().httpsCallable(script.functionLocation)(data);
    },
    [firebase]
  );

  const onSubmit = async (data: any) => {
    runScript(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {script.arguments.map((argument) => (
        <input
          key={argument.name}
          {...register(argument.name, {
            required: argument.isRequired,
          })} // custom message
        />
      ))}

      <input type="submit" />
    </form>
  );
};
