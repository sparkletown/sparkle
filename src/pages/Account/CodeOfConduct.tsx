import React from "react";
import { useForm, useFormState } from "react-hook-form";
import { useAsyncFn } from "react-use";

import { WorldWithId } from "types/id";

import { externalUrlAdditionalProps } from "utils/url";

import { Loading } from "components/molecules/Loading";

import { ButtonNG } from "components/atoms/ButtonNG";

type CodeOfConductProps = {
  world: WorldWithId;
  proceed: () => void;
};

export const CodeOfConduct: React.FC<CodeOfConductProps> = ({
  world,
  proceed,
}) => {
  const { register, handleSubmit, control, formState, watch } = useForm<
    Record<string, boolean>
  >({
    mode: "onChange",
  });

  const { errors } = useFormState({ control });

  const [
    { loading: isUpdating, error: httpError },
    onSubmit,
  ] = useAsyncFn(async () => {
    proceed();
  }, [proceed]);

  const codeOfConductQuestions = world?.questions?.code ?? [];

  return (
    <div className="CodeOfConduct page-container">
      <div className="CodeOfConduct__form">
        <div>
          <h2 className="CodeOfConduct__title">Agree to our terms</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="form">
            {codeOfConductQuestions.map((question) => (
              <div className="input-group" key={question.name}>
                <label
                  htmlFor={question.name}
                  className={`checkbox ${
                    watch(question.name) && "checkbox-checked"
                  }`}
                >
                  {question.name}:{" "}
                  {question.link && (
                    <a href={question.link} {...externalUrlAdditionalProps}>
                      {question.text}
                    </a>
                  )}
                  {!question.link && question.text}
                </label>

                <input
                  type="checkbox"
                  id={question.name}
                  {...register(question.name, {
                    required: true,
                  })}
                />
                {errors[question.name]?.type === "required" && (
                  <span className="input-error">Required</span>
                )}
              </div>
            ))}

            <div className="input-group">
              <ButtonNG
                variant="primary"
                type="submit"
                disabled={!formState.isValid || isUpdating}
              >
                Enter the event
              </ButtonNG>
              {isUpdating && <Loading />}
              {httpError && (
                <span className="input-error">{httpError.message}</span>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
