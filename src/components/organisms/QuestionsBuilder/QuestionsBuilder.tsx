import React from "react";
import { FieldErrors, FieldValues } from "react-hook-form";

import { Question } from "types/Question";

import {
  UseArrayAdd,
  UseArrayClear,
  UseArrayRemove,
  UseArrayUpdate,
} from "hooks/useArray";

import { AdminSidebarSectionSubTitle } from "components/organisms/AdminVenueView/components/AdminSidebarSectionSubTitle";

import { QuestionFieldSet } from "components/molecules/QuestionInputFieldSet";

import { ButtonNG } from "components/atoms/ButtonNG";

import "./QuestionsBuilder.scss";

export interface QuestionsBuilderProps {
  items: Question[];
  name: string;
  hasLink?: boolean;
  register: (Ref: unknown, RegisterOptions?: unknown) => void;
  title?: string;
  errors?: FieldErrors<FieldValues>;
  onAdd: UseArrayAdd<Question>;
  onUpdate: UseArrayUpdate<Question>;
  onClear: UseArrayClear<Question>;
  onRemove: UseArrayRemove<Question>;
}

export const QuestionsBuilder: React.FC<QuestionsBuilderProps> = ({
  items,
  name,
  hasLink,
  register,
  title,
  errors,
  onAdd,
  onUpdate,
  onClear,
  onRemove,
}) => {
  const count = items?.length ?? 0;
  return (
    <div className="QuestionsBuilder">
      {title && (
        <AdminSidebarSectionSubTitle>{title}</AdminSidebarSectionSubTitle>
      )}

      {Array.from({ length: count }).map((_, index) => {
        return (
          <QuestionFieldSet
            errors={errors}
            hasLink={hasLink}
            index={index}
            key={`${name}-${index}`}
            name={name}
            onUpdate={onUpdate}
            onRemove={onRemove}
            register={register}
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
