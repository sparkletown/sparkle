import React, { useCallback, useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { faPaperPlane, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { InputField } from "components/attendee/InputField";

import { MAX_POLL_QUESTIONS } from "settings";

import { PollQuestion, PollValues } from "types/chat";

import "./PollBox.scss";

export interface PollBoxProps {
  onPollSubmit: (poll: PollValues) => void;
}

const DEFAULT_QUESTION: Partial<PollQuestion> = { name: "" };
const DEFAULT_VALUES = {
  topic: "",
  questions: [DEFAULT_QUESTION, DEFAULT_QUESTION],
};

export const PollBox: React.FC<PollBoxProps> = ({ onPollSubmit }) => {
  const { register, control, handleSubmit, watch } = useForm<PollValues>({
    defaultValues: DEFAULT_VALUES,
  });
  const { fields, append } = useFieldArray({ name: "questions", control });
  const [question1, question2] = watch("questions");
  const topic = watch("topic");

  const handlePollSubmit = handleSubmit(({ topic, questions }) =>
    onPollSubmit({
      topic,
      questions: questions.map(({ name }, id) => ({ name, id })),
    })
  );

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
            register={register}
            name={`questions.${index}.name`}
            rules={{ required: true }}
            containerClassName="PollBox__input"
            autoComplete="off"
            placeholder={`Choice ${index + 1}`}
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
    <form className="PollBox" onSubmit={handlePollSubmit}>
      <section className="PollBox__section">
        <InputField
          register={register}
          name="topic"
          rules={{ required: true }}
          containerClassName="PollBox__input"
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
