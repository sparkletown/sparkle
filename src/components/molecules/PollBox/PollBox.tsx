import React, { useCallback, useMemo } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faPlus } from "@fortawesome/free-solid-svg-icons";
import { InputField } from "components/atoms/InputField";
import { MAX_QUESTIONS_NUMBER } from "settings";
import "./PollBox.scss";

export type Question = {
  name: string;
};

export type PollValues = {
  topic: string;
  questions: Question[];
};

export interface PollBoxProps {
  onSubmit: (args: PollValues) => void;
}

const defaultQuestion: Question = { name: "" };
const defaultValues = {
  topic: "",
  questions: [defaultQuestion, defaultQuestion],
};

export const PollBox: React.FC<PollBoxProps> = ({ onSubmit }) => {
  const { control, handleSubmit, reset, watch } = useForm<PollValues>({
    defaultValues,
  });
  const { fields, append } = useFieldArray({ name: "questions", control });

  const onCustomSubmit = handleSubmit((data) => {
    onSubmit(data);
    reset();
  });

  const isDisabled = useMemo(() => {
    const [question1, question2] = watch("questions");
    return !(watch("topic") && question1.name && question2.name);
  }, [watch]);

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
  const renderedChoices = useMemo(
    () =>
      fields.map((field, index) => (
        <section className="PollBox__section" key={field.id}>
          <Controller
            as={
              <InputField
                containerClassName="PollBox__input"
                autoComplete="off"
                placeholder={formatPlaceholder(index)}
              />
            }
            control={control}
            name={`questions.${index}.name`}
          />
          {showAppend(index) && (
            <button className="PollBox__append-button" onClick={addChoice}>
              <FontAwesomeIcon icon={faPlus} />
            </button>
          )}
        </section>
      )),
    [addChoice, fields, showAppend, formatPlaceholder, control]
  );

  return (
    <form className="PollBox" onSubmit={onCustomSubmit}>
      <section className="PollBox__section">
        <Controller
          as={
            <InputField
              containerClassName="PollBox__input"
              name="topic"
              placeholder="Your question..."
              autoComplete="off"
            />
          }
          control={control}
          name="topic"
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
