import React, { useEffect } from "react";
import { Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useAsyncFn } from "react-use";
import dayjs from "dayjs";

import { DAYJS_INPUT_DATE_FORMAT, DAYJS_INPUT_TIME_FORMAT } from "settings";

import { deleteEvent, EventInput } from "api/admin";

import { VenueEvent } from "types/venues";

import { WithId } from "utils/id";

import { RenderMarkdown } from "components/organisms/RenderMarkdown";

export type TimingDeleteModalProps = {
  show: boolean;
  onHide: () => void;
  venueId: string;
  event?: WithId<VenueEvent>;
};

export const TimingDeleteModal: React.FC<TimingDeleteModalProps> = ({
  show,
  onHide,
  venueId,
  event,
}) => {
  const { handleSubmit, formState, reset } = useForm<EventInput>({
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

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
    if (event) {
      await deleteEvent(venueId, event.id);
    }
    onHide();
  }, [event, onHide, venueId]);

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
    <Modal show={show} onHide={onHide}>
      <div className="form-container">
        <h2>Delete event</h2>
        <form onSubmit={handleSubmit(deleteVenueEvent)} className="form">
          <div className="input-group">
            <p>Name: {event?.name}</p>
            <RenderMarkdown text={`Description: ${event?.description}`} />
            <p>
              Time: {eventStartTime}-{eventEndTime}
            </p>
            <p>Duration: {eventDuration}</p>
            <p>Are you sure you wish to delete this event?</p>
          </div>
          <button
            className="btn btn-block btn-centered btn-danger"
            type="submit"
            disabled={formState.isSubmitting || isDeletingEvent}
          >
            Delete
          </button>
        </form>
      </div>
    </Modal>
  );
};
