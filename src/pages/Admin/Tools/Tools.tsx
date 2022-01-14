import React, { useState } from "react";
import { useForm } from "react-hook-form";
import firebase from "firebase/app";

import * as scripts from "./scripts";
import { SelfServeScript } from "./types";

export const Tools: React.FC = () => {
  const [chosenScript, setChosenScript] = useState<SelfServeScript>();

  return (
    <div>
      {chosenScript ? (
        <Script script={chosenScript} />
      ) : (
        Object.values(scripts).map((script) => (
          <button
            onClick={() => setChosenScript(script)}
            key={`${script.name}-${script.functionLocation}`}
          >
            {script.name}
          </button>
        ))
      )}
    </div>
  );
};

export const Script: React.FC<{ script: SelfServeScript }> = ({ script }) => {
  const { register, handleSubmit } = useForm();

  const [links, setLinks] = useState<{ [key: string]: string }>();

  const onSubmit = async (data: Object) => {
    console.log({ data });
    const response = await firebase
      .functions()
      .httpsCallable(script.functionLocation)(data);

    console.log(response.data);

    setLinks(response.data);
  };

  if (links) {
    return (
      <div>
        {Object.entries(links).map(([name, link]) => (
          <p key={`${name}:${link}`}>
            {name} &nbsp;
            <a href={link}>Download</a>
          </p>
        ))}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {script.arguments.map((argument) => (
        <div key={argument.name}>
          <span>{argument.title}</span>
          <input ref={register({ required: true })} name={argument.name} />
        </div>
      ))}

      <button type="submit"> SUBMIT </button>
    </form>
  );
};
