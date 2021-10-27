import React from "react";
import { FieldErrors, FieldValues } from "react-hook-form";

import { Question } from "types/Question";

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
  onAdd: () => void;
  onClear: () => void;
  onRemove: (context: { index: number }) => void;
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

      {Array.from({ length: count }).map((_, index) => {
        // @debt any arbitrary question should be able to be removed, not just the last one
        // NOTE: due to incomplete array/form logic, only last element gets removed, don't provide remove for the rest
        const isLast = count && index === count - 1;
        return (
          <QuestionFieldSet
            errors={errors}
            hasLink={hasLink}
            index={index}
            key={`${name}-${index}`}
            name={name}
            onRemove={isLast ? onRemove : undefined}
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
