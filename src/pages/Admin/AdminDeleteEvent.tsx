import React, { useCallback, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import dayjs from "dayjs";

import { VenueEvent } from "types/venues";

import { deleteEvent, EventInput } from "api/admin";
import { WithId } from "utils/id";

interface PropsType {
  show: boolean;
  onHide: () => void;
  venueId: string;
  event?: WithId<VenueEvent>;
}

const AdminDeleteEvent: React.FunctionComponent<PropsType> = ({
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
    if (!event) {
      reset({});
    } else {
      reset({
        name: event.name,
        description: event.description,
        start_date: dayjs.unix(event.start_utc_seconds).format("YYYY-MM-DD"),
        start_time: dayjs.unix(event.start_utc_seconds).format("HH:mm"),
        duration_hours: event.duration_minutes / 60,
      });
    }
  }, [event, reset]);

  const onSubmit = useCallback(async () => {
    if (event) {
      await deleteEvent(venueId, event.id);
    }
    onHide();
  }, [event, onHide, venueId]);

  return (
    <Modal show={show} onHide={onHide}>
      <div className="form-container">
        <h2>Delete event</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <div className="input-group">
            <p>Name: {event?.name}</p>
            <p>Description: {event?.description}</p>
            <p>
              Time:{" "}
              {event
                ? `${dayjs(event.start_utc_seconds * 1000).format(
                    "ha"
                  )}-${dayjs(
                    (event.start_utc_seconds + 60 * event.duration_minutes) *
                      1000
                  ).format("ha")} ${dayjs(
                    event.start_utc_seconds * 1000
                  ).format("dddd MMMM Do")}`
                : "Unknown"}
            </p>
            <p>
              Duration:{" "}
              {event ? `${event?.duration_minutes / 60} hours` : "Unknown"}
            </p>
            <p>Are you sure you wish to delete this event?</p>
          </div>
          <input
            className="btn btn-primary btn-block btn-centered"
            type="submit"
            value="Delete"
            disabled={formState.isSubmitting}
          />
        </form>
      </div>
    </Modal>
  );
};

export default AdminDeleteEvent;
