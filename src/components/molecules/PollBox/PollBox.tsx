import React, { useCallback, useMemo } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faPlus } from "@fortawesome/free-solid-svg-icons";

import { MAX_POLL_CHOICES } from "settings";

import { PollValues, PollQuestion } from "types/chat";

import { InputField } from "components/atoms/InputField";

import "./PollBox.scss";

export interface PollBoxProps {
  createPoll: (props: PollValues) => void;
}

const DEFAULT_QUESTION: PollQuestion = { name: "" };
const DEFAULT_VALUES = {
  topic: "",
  questions: [DEFAULT_QUESTION, DEFAULT_QUESTION],
};

export const PollBox: React.FC<PollBoxProps> = ({ createPoll }) => {
  const { control, handleSubmit, reset, watch } = useForm<PollValues>({
    defaultValues: DEFAULT_VALUES,
  });
  const { fields, append } = useFieldArray({ name: "questions", control });
  const [question1, question2] = watch("questions");
  const topic = watch("topic");

  const onPollSubmit = handleSubmit((data) => {
    createPoll(data);
    reset();
  });

  const isDisabled = !(topic && question1.name && question2.name);

  const addChoice = useCallback(() => append(DEFAULT_QUESTION), [append]);
  const showAppend = useCallback(
    (index) => index + 1 === fields.length && MAX_POLL_CHOICES > fields.length,
    [fields]
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
                placeholder={`Choice ${index + 1}`}
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
    [addChoice, fields, showAppend, control]
  );

  return (
    <form className="PollBox" onSubmit={onPollSubmit}>
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
      {renderedChoices}
    </form>
  );
};
