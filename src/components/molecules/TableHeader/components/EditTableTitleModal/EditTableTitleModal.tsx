import React, { useCallback } from "react";
import { Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";

import { MAX_TABLE_CAPACITY, MIN_TABLE_CAPACITY } from "settings";

import { InputField } from "components/atoms/InputField";

import "./EditTableTitleModal.scss";

export interface EditTableTitleModalProps {
  isShown: boolean;
  title: string;
  description?: string;
  capacity: number;
  error: string;
  onHide: () => void;
  onCancel: () => void;
  onSave: (values: EditTableForm) => void;
}

export interface EditTableForm {
  title: string;
  description?: string;
  capacity: number;
}

export const EditTableTitleModal: React.FC<EditTableTitleModalProps> = ({
  isShown,
  title,
  description,
  capacity,
  error,
  onSave,
  onHide,
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    errors,
    // formState,
    // setError,
    // clearError,
    watch,
  } = useForm<EditTableForm>({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      title,
      description,
      capacity,
    },
  });

  const values = watch();

  const onSubmit = useCallback(() => {
    onSave(values);
    onHide();
  }, [onHide, onSave, values]);

  return (
    <Modal show={isShown} onHide={onHide}>
      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)} className="edit-table-modal">
          <InputField
            ref={register({ required: true })}
            name="title"
            containerClassName="edit-table-modal__input--spacing"
            placeholder="Table topic"
          />
          {errors.title && errors.title.type === "required" && (
            <span className="input-error">Title is required</span>
          )}
          <InputField
            ref={register}
            name="description"
            containerClassName="edit-table-modal__input--spacing"
            placeholder="Describe this table (optional)"
          />
          <div className="edit-table-modal__capacity">
            <label className="edit-table-modal__max-capacity">
              Number of seats (max {MAX_TABLE_CAPACITY})
            </label>
            <InputField
              ref={register({
                required: true,
                max: MAX_TABLE_CAPACITY,
                min: MIN_TABLE_CAPACITY,
              })}
              name="capacity"
              type="number"
              min={MIN_TABLE_CAPACITY}
              max={MAX_TABLE_CAPACITY}
              placeholder="Max seats"
            />
          </div>
          {errors.capacity && errors.capacity.type === "required" && (
            <span className="input-error">Capacity is required</span>
          )}
          {errors.capacity &&
            (errors.capacity.type === "min" ||
              errors.capacity.type === "max") && (
              <span className="input-error">
                Capacity must be between {MIN_TABLE_CAPACITY} and{" "}
                {MAX_TABLE_CAPACITY}
              </span>
            )}
          {error && <label className="input-error">{error}</label>}
          <div className="edit-table-modal__footer-buttons">
            <button
              className="btn btn-centered btn-secondary"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-centered btn-primary">
              Save
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};
