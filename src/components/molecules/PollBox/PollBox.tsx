import React, { useCallback, useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faPlus } from "@fortawesome/free-solid-svg-icons";
import { MAX_QUESTIONS_NUMBER } from "settings";
import "./PollBox.scss";

export interface PollBoxProps {}

type Question = {
  name: string;
};

type FormValues = {
  topic: string;
  questions: Question[];
};

const defaultQuestion: Question = { name: "" };
const defaultValues = {
  topic: "",
  questions: [defaultQuestion, defaultQuestion],
};
const isRequired = { required: true };

export const PollBox: React.FC<PollBoxProps> = () => {
  const { register, control, handleSubmit, reset, watch } = useForm<FormValues>(
    {
      defaultValues,
      mode: "onSubmit",
    }
  );

  const { fields, append } = useFieldArray({
    name: "questions",
    control,
  });

  const onSubmit = handleSubmit((data) => {
    console.log(data);
    reset();
  });

  const addChoice = useCallback(() => append(defaultQuestion), [append]);
  const showAppend = useCallback(
    (index) =>
      index + 1 === fields.length && MAX_QUESTIONS_NUMBER > fields.length,
    [fields]
  );
  const isDisabled = useMemo(
    () =>
      !(
        watch("topic") &&
        watch("questions")[0].name &&
        watch("questions")[1].name
      ),
    [watch]
  );

  const renderChoiceFields = useMemo(
    () =>
      fields.map((field, index) => {
        return (
          <section className="PollBox__section" key={field.id}>
            <input
              className="PollBox__input"
              autoComplete="off"
              placeholder={`Choice ${index + 1}`}
              name={`questions.${index}.name`}
              ref={register(isRequired)}
            />
            {showAppend(index) && (
              <button className="PollBox__submit-button" onClick={addChoice}>
                <FontAwesomeIcon
                  icon={faPlus}
                  className="PollBox__submit-button-icon"
                />
              </button>
            )}
          </section>
        );
      }),
    [addChoice, fields, register, showAppend]
  );

  return (
    <form className="PollBox" onSubmit={onSubmit}>
      <section className="PollBox__section">
        <input
          className="PollBox__input"
          ref={register(isRequired)}
          name="topic"
          placeholder="Your topic..."
          autoComplete="off"
        />
        <button
          className="PollBox__submit-button"
          type="submit"
          disabled={isDisabled}
        >
          <FontAwesomeIcon
            icon={faPaperPlane}
            className="PollBox__submit-button-icon"
          />
        </button>
      </section>
      {renderChoiceFields}
    </form>
  );
};
