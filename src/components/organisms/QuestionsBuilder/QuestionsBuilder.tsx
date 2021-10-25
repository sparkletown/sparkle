import React from "react";
import { Control, FieldErrors, FieldValues } from "react-hook-form";

import { AdminSidebarSectionSubTitle } from "components/organisms/AdminVenueView/components/AdminSidebarSectionSubTitle";

import { QuestionFieldSet } from "components/molecules/QuestionInputFieldSet";

import { ButtonNG } from "components/atoms/ButtonNG";

import "./QuestionsBuilder.scss";

export interface QuestionsBuilderProps {
  control?: Control;
  count?: number;
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
  control,
  count,
  name,
  hasLink,
  register,
  title,
  errors,
  onAdd,
  onClear,
  onRemove,
}) => (
  <div className="QuestionsBuilder" style={{ marginBottom: "1.5rem" }}>
    {title && (
      <AdminSidebarSectionSubTitle>{title}</AdminSidebarSectionSubTitle>
    )}

    {Array.from({ length: count ?? 0 }).map((_, index) => (
      // @debt any arbitrary question should be able to be removed, not just the last one
      // NOTE: due to incomplete array/form logic, only last element gets removed, don't provide remove for the rest
      <QuestionFieldSet
        errors={errors}
        hasLink={hasLink}
        index={index}
        key={`${name}-${index}`}
        name={name}
        onRemove={count && index === count - 1 ? onRemove : undefined}
        register={register}
      />
    ))}

    <div className="QuestionsBuilder__buttons">
      <ButtonNG variant="primary" onClick={onAdd}>
        Add question
      </ButtonNG>
      {(count ?? 0) > 0 && (
        <ButtonNG variant="danger" onClick={onClear}>
          Remove all
        </ButtonNG>
      )}
    </div>
  </div>
);
