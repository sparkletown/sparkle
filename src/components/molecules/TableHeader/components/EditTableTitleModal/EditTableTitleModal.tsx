import React from "react";
import { useForm, useFormState } from "react-hook-form";
import { useAsyncFn } from "react-use";
import { InputField } from "components/attendee/InputField";

import { MAX_TABLE_CAPACITY, MIN_TABLE_CAPACITY } from "settings";

import { updateVenueTable } from "api/table";

import { Table } from "types/Table";

import { useWorldAndSpaceByParams } from "hooks/spaces/useWorldAndSpaceByParams";

import { Modal } from "components/molecules/Modal";

import { ButtonNG } from "components/atoms/ButtonNG";

import "./EditTableTitleModal.scss";

export interface EditTableForm {
  title: string;
  subtitle?: string;
  capacity: number;
}

export interface EditTableTitleModalProps {
  isShown: boolean;
  title: string;
  subtitle?: string;
  capacity: number;
  defaultTables: Table[];
  tableOfUser?: Table;
  onHide: () => void;
}

export const EditTableTitleModal: React.FC<EditTableTitleModalProps> = ({
  isShown,
  title,
  defaultTables,
  tableOfUser,
  subtitle,
  capacity,
  onHide,
}) => {
  const { spaceId } = useWorldAndSpaceByParams();

  const { register, handleSubmit, control } = useForm<EditTableForm>({
    mode: "onBlur",
    reValidateMode: "onBlur",
    defaultValues: {
      title,
      subtitle,
      capacity,
    },
  });

  const { errors } = useFormState({ control });

  // use useAsyncFn for easier error handling, instead of state hook
  const [{ error: httpError, loading: isUpdating }, updateTables] = useAsyncFn(
    async (values: EditTableForm) => {
      if (!spaceId || !tableOfUser) return;

      const newTable = {
        ...tableOfUser,
        ...values,
      };

      await updateVenueTable({
        venueId: spaceId,
        newTable,
        defaultTables,
      }).then(onHide);
    },
    [onHide, tableOfUser, spaceId, defaultTables]
  );

  return (
    <Modal show={isShown} onHide={onHide}>
      <form
        onSubmit={handleSubmit(updateTables)}
        className="EditTableTitleModal"
      >
        <InputField
          register={register}
          name="title"
          rules={{ required: true }}
          containerClassName="EditTableTitleModal__input--spacing"
          placeholder="Table topic"
          disabled={isUpdating}
        />
        {errors.title?.type === "required" && (
          <span className="input-error">Topic is required</span>
        )}

        <InputField
          register={register}
          name="subtitle"
          containerClassName="EditTableTitleModal__input--spacing"
          placeholder="Describe this table (optional)"
          disabled={isUpdating}
        />

        <div className="EditTableTitleModal__capacity">
          <label className="EditTableTitleModal__max-capacity">
            Number of seats (max {MAX_TABLE_CAPACITY})
            <InputField
              register={register}
              rules={{
                required: true,
                max: MAX_TABLE_CAPACITY,
                min: MIN_TABLE_CAPACITY,
              }}
              className="EditTableTitleModal__max-capacity--input"
              name="capacity"
              type="number"
              disabled={isUpdating}
              min={MIN_TABLE_CAPACITY}
              max={MAX_TABLE_CAPACITY}
              placeholder="Max seats"
            />
          </label>
        </div>
        {errors.capacity?.type === "required" && (
          <span className="input-error">Capacity is required</span>
        )}
        {(errors.capacity?.type === "min" ||
          errors.capacity?.type === "max") && (
          <span className="input-error">
            Capacity must be between {MIN_TABLE_CAPACITY} and{" "}
            {MAX_TABLE_CAPACITY}
          </span>
        )}
        {httpError && (
          <label className="input-error">{httpError.message}</label>
        )}

        <div className="EditTableTitleModal__footer-buttons">
          <ButtonNG onClick={onHide}>Cancel</ButtonNG>
          <ButtonNG type="submit" disabled={isUpdating} variant="primary">
            Save
          </ButtonNG>
        </div>
      </form>
    </Modal>
  );
};
