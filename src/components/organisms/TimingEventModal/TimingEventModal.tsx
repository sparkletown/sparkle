import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import dayjs from "dayjs";

import { DAYJS_INPUT_DATE_FORMAT, DAYJS_INPUT_TIME_FORMAT } from "settings";

import { createEvent, updateEvent, WorldScheduleEvent } from "api/admin";

import { SpaceId, WorldId } from "types/id";
import { WorldEvent } from "types/venues";

import { MaybeWithId } from "utils/id";

import { eventEditSchema, SpaceType } from "forms/eventEditSchema";

import { useOwnedVenues } from "hooks/useOwnedVenues";
import { useUser } from "hooks/useUser";

import { Modal } from "components/molecules/Modal";

import { ButtonNG } from "components/atoms/ButtonNG";
import { Dropdown } from "components/atoms/Dropdown";

import "./TimingEventModal.scss";

export type TimingEventModalProps = {
  show: boolean;
  onHide: () => void;
  event?: WorldEvent;
  spaceId?: SpaceId | string;
  onDelete?: (event?: WorldEvent) => void;
  setShowDeleteEventModal: () => void;
  worldId?: WorldId | string;
};

// Dispatch<SetStateAction<WithId<Experience> | undefined>>
export const TimingEventModal: React.FC<TimingEventModalProps> = ({
  show,
  onHide,
  spaceId,
  worldId,
  onDelete,
  event,
  setShowDeleteEventModal,
}) => {
  const eventSpaceId = event?.spaceId || spaceId;

  const {
    register,
    handleSubmit,
    errors,
    formState,
    reset,
    watch,
  } = useForm<WorldScheduleEvent>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    validationSchema: eventEditSchema,
    validationContext: {
      eventSpaceId,
    },
  });

  const values = watch();

  // When we're creating a new event it will default to
  // being on the space that triggered this modal.
  const { userId } = useUser();
  const { ownedVenues, isLoading: isSpacesLoading } = useOwnedVenues({
    worldId,
    userId,
  });
  const [selectedSpace, setSelectedSpace] = useState<SpaceType>();

  const eventSpace = ownedVenues.find(({ id }) => id === eventSpaceId);

  const spacesMap: SpaceType[] = ownedVenues.map((venue) => ({
    id: venue.id,
    name: venue.name,
  }));

  useEffect(() => {
    if (event?.id) {
      reset({
        name: event.name,
        description: event.description,
        startDate: dayjs
          .unix(event.startUtcSeconds)
          .format(DAYJS_INPUT_DATE_FORMAT),
        startTime: dayjs
          .unix(event.startUtcSeconds)
          .format(DAYJS_INPUT_TIME_FORMAT),
        durationHours: Math.floor(event.durationMinutes / 60),
        durationMinutes: event.durationMinutes % 60,
        host: event.host,
      });
    }
  }, [event, reset, eventSpaceId, values.space]);

  const onUpdateEvent = useCallback(
    async (data: WorldScheduleEvent) => {
      const spaceId = selectedSpace?.id ?? eventSpaceId;
      const eventWorldId = eventSpace?.worldId ?? worldId;

      if (!spaceId || !eventWorldId) {
        return;
      }

      const start = dayjs(`${data.startDate} ${data.startTime}`);
      const formEvent: MaybeWithId<WorldEvent> = {
        name: data.name,
        description: data.description,
        startUtcSeconds:
          start.unix() || Math.floor(new Date().getTime() / 1000),
        durationMinutes: data.durationHours * 60 + (data.durationMinutes ?? 0),
        host: data.host,
        spaceId: spaceId,
        worldId: eventWorldId,
      };
      // Add the ID conditionally - otherwise the field is set to undefined
      // which firebase does not like.
      if (spaceId) {
        if (event?.id) {
          formEvent.id = event.id;
          await updateEvent(formEvent as WorldEvent);
        } else {
          await createEvent(formEvent);
        }
      }
      onHide();
    },
    [
      selectedSpace?.id,
      eventSpaceId,
      eventSpace?.worldId,
      worldId,
      onHide,
      event?.id,
    ]
  );

  const showDeleteButton = event?.id;
  const handleDelete = () => {
    onHide();
    onDelete?.(event);
    setShowDeleteEventModal();
  };

  const renderedSpaceIds = useMemo(
    () =>
      spacesMap.map((space) => {
        return (
          <div
            key={space.id}
            className="SpacesDropdown__item"
            onClick={() => setSelectedSpace(space)}
          >
            {space.name}
          </div>
        );
      }) ?? [],
    [spacesMap]
  );

  if (isSpacesLoading) {
    return null;
  }

  return (
    <Modal show={show} onHide={onHide} centered autoHide>
      <div className="TimingEventModal form-container">
        <h2>Add experience</h2>
        <form className="form" onSubmit={handleSubmit(onUpdateEvent)}>
          <p>Your experience is in {eventSpace?.name}</p>
          {!eventSpace?.name && (
            <div className="TimingEventModal__input-group">
              <Dropdown title={selectedSpace?.name ?? "None"}>
                {renderedSpaceIds}
              </Dropdown>
              {errors.space && (
                <span className="input-error">{errors.space.message}</span>
              )}
            </div>
          )}

          <div className="TimingEventModal__input-group">
            <label htmlFor="name">Name your experience</label>
            <input
              id="name"
              name="name"
              className="TimingEventModal__input-group__modal-input"
              placeholder="Name"
              ref={register}
            />
            {errors.name && (
              <span className="input-error">{errors.name.message}</span>
            )}
          </div>

          <div className="TimingEventModal__input-group">
            <label htmlFor="description">Describe your experience</label>
            <textarea
              name="description"
              className="TimingEventModal__input-group__modal-input"
              placeholder="Description"
              ref={register}
            />
            {errors.description && (
              <span className="input-error">{errors.description.message}</span>
            )}
          </div>

          <div className="TimingEventModal__input-group">
            <label htmlFor="host">Host (people hosting the event)</label>
            <input
              id="host"
              name="host"
              className="TimingEventModal__input-group__modal-input"
              placeholder="Dottie Longstockings"
              ref={register}
            />
            {errors.host && (
              <span className="input-error">{errors.host.message}</span>
            )}
          </div>

          <div className="TimingEventModal__input-group">
            <label htmlFor="date">
              Start date and time (use your own time zone; it will be
              automatically localized)
            </label>
            <div className="TimingEventModal__container">
              {/*
                  @debt These wrapper divs are here to unmuddle some precedance issues
                  in the CSS that causes the inputs to have 100% width. This
                  form is going to have some layout changes applied that should
                  resolve this..
                  */}
              <div>
                <input
                  type="date"
                  min={dayjs().format(DAYJS_INPUT_DATE_FORMAT)}
                  name="startDate"
                  className="TimingEventModal__input-group__modal-input"
                  ref={register}
                />
              </div>
              <div>
                <input
                  type="time"
                  name="startTime"
                  className="TimingEventModal__input-group__modal-input"
                  ref={register}
                />
              </div>
              <div className="TimingEventModal__container">
                {errors.startDate && (
                  <span className="input-error">
                    {errors.startDate.message}
                  </span>
                )}
                {errors.startTime && (
                  <span className="input-error">
                    {errors.startTime.message}
                  </span>
                )}
              </div>
            </div>

            <div className="TimingEventModal__input-group">
              <label>Duration</label>
              <div className="TimingEventModal__duration_container">
                <input
                  name="durationHours"
                  className="TimingEventModal__input-group__modal-input--indent"
                  placeholder="hours"
                  ref={register}
                  size={8}
                />
                <label htmlFor="durationHours">hour(s)</label>
                <input
                  name="durationMinutes"
                  className="TimingEventModal__input-group__modal-input--indent"
                  placeholder="minutes"
                  ref={register}
                  size={8}
                />
                <label htmlFor="durationMinutes">minutes</label>
              </div>
              <div className="TimingEventModal__container">
                {errors.durationHours && (
                  <span className="input-error">
                    {errors.durationHours.message}
                  </span>
                )}
                {errors.durationMinutes && (
                  <span className="input-error">
                    {errors.durationMinutes.message}
                  </span>
                )}
              </div>
            </div>

            <div className="TimingEventModal__container">
              {
                // @debt: move this delete button to the experience list component
              }
              {showDeleteButton && (
                <ButtonNG
                  disabled={formState.isSubmitting}
                  variant="danger"
                  onClick={handleDelete}
                >
                  Delete
                </ButtonNG>
              )}

              <ButtonNG variant="secondary" onClick={onHide}>
                Cancel
              </ButtonNG>

              <ButtonNG
                disabled={formState.isSubmitting}
                variant="primary"
                type="submit"
              >
                {event?.id ? "Update" : "Create"}
              </ButtonNG>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
};
