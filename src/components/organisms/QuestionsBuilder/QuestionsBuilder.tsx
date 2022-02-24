import React from "react";
import {
  FieldErrors,
  FieldValues,
  UseFieldArrayRemove,
  UseFormRegister,
} from "react-hook-form";

import { Question } from "types/Question";
import { WorldEntranceFormInput } from "types/world";

import { ButtonNG } from "components/atoms/ButtonNG";
import { QuestionFieldSet } from "components/molecules/QuestionInputFieldSet";
import { AdminSidebarSectionSubTitle } from "components/organisms/AdminVenueView/components/AdminSidebarSectionSubTitle";

import "./QuestionsBuilder.scss";

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
      {title && (
        <AdminSidebarSectionSubTitle>{title}</AdminSidebarSectionSubTitle>
      )}

      {items.map((item, index) => {
        return (
          <QuestionFieldSet
            errors={errors}
            hasLink={hasLink}
            index={index}
            key={`${name}-${index}`}
            name={name}
            onRemove={onRemove}
            register={register}
            item={item}
          />
        );
      })}

      <div className="QuestionsBuilder__buttons">
        <ButtonNG variant="primary" onClick={onAdd}>
          Add question
        </ButtonNG>
        {count > 0 && (
          <ButtonNG variant="danger" onClick={onClear}>
            Remove all
          </ButtonNG>
        )}
      </div>
    </div>
  );
};
