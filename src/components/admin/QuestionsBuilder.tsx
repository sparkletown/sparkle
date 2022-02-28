import React from "react";
import {
  FieldErrors,
  FieldValues,
  UseFieldArrayRemove,
  UseFormRegister,
} from "react-hook-form";
import { Button } from "components/admin/Button";
import { InputGroupSubtitle } from "components/admin/InputGroupSubtitle";
import { QuestionFieldSet } from "components/admin/QuestionFieldSet";

import { Question } from "types/Question";
import { WorldEntranceFormInput } from "types/world";

export interface QuestionsBuilderProps {
  items: Question[];
  name: string;
  hasLink?: boolean;
  register: UseFormRegister<WorldEntranceFormInput>;
  title?: string;
  errors?: FieldErrors<FieldValues>;
  onAdd: () => void;
  onClear: () => void;
  onRemove: UseFieldArrayRemove;
}

export const QuestionsBuilder: React.FC<QuestionsBuilderProps> = ({
  items,
  name,
  hasLink,
  register,
  title,
  errors,
  onAdd,
  onClear,
  onRemove,
}) => {
  const count = items?.length ?? 0;
  return (
    <div className="QuestionsBuilder">
      {title && <InputGroupSubtitle>{title}</InputGroupSubtitle>}

      {items.map((_, index) => {
        return (
          <QuestionFieldSet
            errors={errors}
            hasLink={hasLink}
            index={index}
            key={`${name}-${index}`}
            name={name}
            onRemove={onRemove}
            register={register}
          />
        );
      })}

      <div className="QuestionsBuilder__buttons">
        <Button onClick={onAdd}>Add question</Button>

        {count > 0 && (
          <Button variant="danger" onClick={onClear}>
            Remove all
          </Button>
        )}
      </div>
    </div>
  );
};
