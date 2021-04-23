import React, { useCallback, useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faPlus } from "@fortawesome/free-solid-svg-icons";

import "./PollBox.scss";

export interface PollBoxProps {}

type Choice = {
  name: string;
};

type FormValues = {
  question: string;
  choice: Choice[];
};

const defaultChoice: Choice = { name: "" };
const isRequired = { required: true };
const MAX_CHOICES_NUMBER: Number = 8;

const PollBox: React.FC<PollBoxProps> = () => {
  const { register, control, handleSubmit, reset, watch } = useForm<FormValues>(
    {
      defaultValues: {
        question: "",
        choice: [defaultChoice, defaultChoice],
      },
      mode: "onSubmit",
    }
  );

  const { fields, append } = useFieldArray({
    name: "choice",
    control,
  });

  const onSubmit = handleSubmit((data) => {
    console.log(data);
    reset();
  });

  const addChoice = useCallback(() => append(defaultChoice), [append]);
  const showAppend = useCallback(
    (index) =>
      index + 1 === fields.length && MAX_CHOICES_NUMBER > fields.length,
    [fields]
  );
  const isDisabled = useMemo(
    () =>
      !(
        watch("question") &&
        watch("choice")[0].name &&
        watch("choice")[1].name
      ),
    [watch]
  );

  return (
    <form className="pollbox__form" onSubmit={onSubmit}>
      <section className="pollbox__section">
        <input
          className="pollbox__input"
          ref={register(isRequired)}
          name="question"
          placeholder="Your question..."
          autoComplete="off"
        />
        <button
          className="pollbox__submit-button"
          type="submit"
          disabled={isDisabled}
        >
          <FontAwesomeIcon
            icon={faPaperPlane}
            className="pollbox__submit-button-icon"
          />
        </button>
      </section>
      {fields.map((field, index) => {
        return (
          <section className="pollbox__section" key={field.id}>
            <input
              className="pollbox__input"
              autoComplete="off"
              placeholder={`Choice ${index + 1}`}
              name={`choice.${index}.name`}
              ref={register(isRequired)}
            />
            {showAppend(index) && (
              <button className="pollbox__submit-button" onClick={addChoice}>
                <FontAwesomeIcon
                  icon={faPlus}
                  className="pollbox__submit-button-icon"
                />
              </button>
            )}
          </section>
        );
      })}
    </form>
  );
};
