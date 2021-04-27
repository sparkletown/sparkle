import React, { useCallback, useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faPlus } from "@fortawesome/free-solid-svg-icons";
import { MAX_QUESTIONS_NUMBER } from "settings";
import "./PollBox.scss";

export interface PollBoxProps {}

export type Question = {
  name: string;
};

export type PollValues = {
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
  const { register, control, handleSubmit, reset, watch } = useForm<PollValues>(
    { defaultValues }
  );

  const { fields, append } = useFieldArray({
    name: "questions",
    control,
  });

  const onSubmit = handleSubmit((data) => {
    console.log(data);
    reset();
  });

  const isDisabled = useMemo(
    () =>
      !(
        watch("topic") &&
        watch("questions")[0].name &&
        watch("questions")[1].name
      ),
    [watch]
  );

  const addChoice = useCallback(() => append(defaultQuestion), [append]);
  const showAppend = useCallback(
    (index) =>
      index + 1 === fields.length && MAX_QUESTIONS_NUMBER > fields.length,
    [fields]
  );
  const formatPlaceholder = useCallback(
    (index) =>
      index === 0
        ? `Choice ${index + 1} (Max ${MAX_QUESTIONS_NUMBER} choices)`
        : `Choice ${index + 1}`,
    []
  );
  const renderChoiceFields = useMemo(
    () =>
      fields.map((field, index) => (
        <section className="PollBox__section" key={field.id}>
          <input
            className="PollBox__input"
            autoComplete="off"
            placeholder={formatPlaceholder(index)}
            name={`questions.${index}.name`}
            ref={register(isRequired)}
          />
          {showAppend(index) && (
            <button className="PollBox__append-button" onClick={addChoice}>
              <FontAwesomeIcon icon={faPlus} />
            </button>
          )}
        </section>
      )),
    [addChoice, fields, register, showAppend, formatPlaceholder]
  );

  return (
    <form className="PollBox" onSubmit={onSubmit}>
      <section className="PollBox__section">
        <input
          className="PollBox__input"
          ref={register(isRequired)}
          name="topic"
          placeholder="Your question..."
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
