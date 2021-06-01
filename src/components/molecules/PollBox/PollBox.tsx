import React, { useCallback, useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faPlus } from "@fortawesome/free-solid-svg-icons";

import { MAX_POLL_QUESTIONS } from "settings";

import { PollValues, PollQuestion } from "types/chat";

import { InputField } from "components/atoms/InputField";

import "./PollBox.scss";

export interface PollBoxProps {
  createPoll: (poll: PollValues) => void;
  unselectOption: () => void;
}

const DEFAULT_QUESTION: Partial<PollQuestion> = { name: "" };
const DEFAULT_VALUES = {
  topic: "",
  questions: [DEFAULT_QUESTION, DEFAULT_QUESTION],
};

export const PollBox: React.FC<PollBoxProps> = ({
  createPoll,
  unselectOption,
}) => {
  const { register, control, handleSubmit, watch } = useForm<PollValues>({
    defaultValues: DEFAULT_VALUES,
  });
  const { fields, append } = useFieldArray({ name: "questions", control });
  const [question1, question2] = watch("questions");
  const topic = watch("topic");

  const onPollSubmit = handleSubmit(({ topic, questions }) => {
    createPoll({
      topic,
      questions: questions.map(({ name }, id) => ({ name, id })),
    });
    unselectOption();
  });

  const isDisabled = !(topic && question1.name && question2.name);

  const addQuestion = useCallback(() => append(DEFAULT_QUESTION), [append]);
  const checkIfQuestionCanBeAppended = useCallback(
    (questionId) =>
      questionId + 1 === fields.length && MAX_POLL_QUESTIONS > fields.length,
    [fields]
  );

  const renderedQuestions = useMemo(
    () =>
      fields.map((field, index) => (
        <section className="PollBox__section" key={field.id}>
          <InputField
            ref={register({ required: true })}
            containerClassName="PollBox__input"
            autoComplete="off"
            placeholder={`Choice ${index + 1}`}
            name={`questions.${index}.name`}
          />
          {checkIfQuestionCanBeAppended(index) && (
            <button className="PollBox__append-button" onClick={addQuestion}>
              <FontAwesomeIcon icon={faPlus} />
            </button>
          )}
        </section>
      )),
    [addQuestion, fields, checkIfQuestionCanBeAppended, register]
  );

  return (
    <form className="PollBox" onSubmit={onPollSubmit}>
      <section className="PollBox__section">
        <InputField
          ref={register({ required: true })}
          containerClassName="PollBox__input"
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
            size="lg"
          />
        </button>
      </section>
      {renderedQuestions}
    </form>
  );
};
