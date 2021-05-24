import React, { useCallback, useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faPlus } from "@fortawesome/free-solid-svg-icons";

import { MAX_POLL_CHOICES } from "settings";

import { getVenueOwners } from "api/admin";

import { PollValues, PollQuestion } from "types/chat";

import { InputField } from "components/atoms/InputField";

import { useVenueId } from "hooks/useVenueId";
import { useRoles } from "hooks/useRoles";
import { useUser } from "hooks/useUser";

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
  const venueId = useVenueId();
  const { userRoles } = useRoles();
  const { user } = useUser();

  const userId = user?.uid;
  const isAdmin = Boolean(userRoles?.includes("admin"));

  const { register, control, handleSubmit, reset, watch } = useForm<PollValues>(
    {
      defaultValues: DEFAULT_VALUES,
    }
  );
  const { fields, append } = useFieldArray({ name: "questions", control });
  const [question1, question2] = watch("questions");
  const topic = watch("topic");

  const onPollSubmit = handleSubmit(async ({ topic, questions }) => {
    if (!venueId || !userId) return;

    const owners = await getVenueOwners(venueId);

    const newPoll = {
      canBeDeleted: isAdmin && owners.includes(userId),
      topic,
      questions: questions.map(({ name }, id) => ({
        name,
        id,
        votes: 0,
      })),
    };
    createPoll(newPoll);
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
          <InputField
            ref={register({ required: true })}
            containerClassName="PollBox__input"
            autoComplete="off"
            placeholder={`Choice ${index + 1}`}
            name={`questions.${index}.name`}
          />
          {showAppend(index) && (
            <button className="PollBox__append-button" onClick={addChoice}>
              <FontAwesomeIcon icon={faPlus} />
            </button>
          )}
        </section>
      )),
    [addChoice, fields, showAppend, register]
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
      {renderedChoices}
    </form>
  );
};
