import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAsyncFn } from "react-use";
import dayjs from "dayjs";

import { DAYJS_INPUT_DATE_FORMAT, DAYJS_INPUT_TIME_FORMAT } from "settings";

import { deleteEvent, EventInput } from "api/admin";

import { VenueEvent } from "types/venues";

import { WithId, WithVenueId } from "utils/id";

import { RenderMarkdown } from "components/organisms/RenderMarkdown";

import { Modal } from "components/molecules/Modal";

import { ButtonNG } from "components/atoms/ButtonNG";

import "./TimingDeleteModal.scss";

export type TimingDeleteModalProps = {
  show: boolean;
  onHide: () => void;
  event?: WithVenueId<WithId<VenueEvent>>;
};

export const TimingDeleteModal: React.FC<TimingDeleteModalProps> = ({
  show,
  onHide,
  event,
}) => {
  const { handleSubmit, formState, reset } = useForm<EventInput>({
    mode: "onSubmit",
    reValidateMode: "onChange",
  });
  // @debt This makes the deletion happen against the space that owns the event
  // NOT the space that the event is in. There's some bad hierarchy in the
  // database.
  const eventSpaceId = event?.venueId;

  useEffect(() => {
    if (event) {
      reset({
        name: event.name,
        description: event.description,
        start_date: dayjs
          .unix(event.start_utc_seconds)
          .format(DAYJS_INPUT_DATE_FORMAT),
        start_time: dayjs
          .unix(event.start_utc_seconds)
          .format(DAYJS_INPUT_TIME_FORMAT),
        duration_hours: event.duration_minutes / 60,
      });
    }
  }, [event, reset]);

  const [
    { loading: isDeletingEvent },
    deleteVenueEvent,
  ] = useAsyncFn(async () => {
    if (event && eventSpaceId) {
      await deleteEvent(eventSpaceId, event.id);
    }
    onHide();
  }, [event, onHide, eventSpaceId]);

  const eventStartTime = event
    ? dayjs(event.start_utc_seconds * 1000).format("ha")
    : "Unknown";
  const eventEndTime = event
    ? dayjs(
        (event.start_utc_seconds + 60 * event.duration_minutes) * 1000
      ).format("ha")
    : "Unknown";
  const eventDuration = event
    ? `${event.duration_minutes / 60} hours ${
        event.duration_minutes % 60
      } minutes`
    : "Unknown";

  return (
    <Modal isOpen={show} onClose={onHide}>
      <div className="TimingDeleteModal">
        <h2>Delete event</h2>
        <form
          onSubmit={handleSubmit(deleteVenueEvent)}
          className="TimingDeleteModal__container"
        >
          <div>
            <p>Name: {event?.name}</p>
            <RenderMarkdown text={`Description: ${event?.description ?? ""}`} />
            <p>
              Time: {eventStartTime}-{eventEndTime}
            </p>
            <p>Duration: {eventDuration}</p>
            <p>Are you sure you wish to delete this event?</p>
          </div>
          <ButtonNG
            className="TimingDeleteModal__button"
            type="submit"
            variant="danger"
            disabled={formState.isSubmitting || isDeletingEvent}
          >
            Delete
          </ButtonNG>
        </form>
      </div>
    </Modal>
  );
};
