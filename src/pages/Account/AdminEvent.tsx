import React, { useCallback } from "react";
import { Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { VenueEvent } from "types/VenueEvent";
import dayjs from "dayjs";
import * as Yup from "yup";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import { createEvent, EventInput, updateEvent } from "api/admin";
import { WithId } from "utils/id";
dayjs.extend(isSameOrAfter);

interface PropsType {
  show: boolean;
  onHide: () => void;
  venueId: string;
  event?: WithId<VenueEvent>;
}

const validationSchema = Yup.object().shape<EventInput>({
  name: Yup.string().required("Name required"),
  description: Yup.string().required("Description required"),
  start_date: Yup.string()
    .required("Start date required")
    .matches(
      /\d{4}-\d{2}-\d{2}/,
      'Start date must have the format "yyyy-mm-dd"'
    )
    .test(
      "start_date_future",
      "Start date must be in the futur",
      (start_date) => {
        return dayjs(start_date).isSameOrAfter(dayjs(), "day");
      }
    ),
  start_time: Yup.string().required("Start time required"),
  end_date: Yup.string()
    .required("End date required")
    .test("end_date_future", "End date must be in the futur", (end_date) => {
      return dayjs(end_date).isSameOrAfter(dayjs(), "day");
    }),
  end_time: Yup.string().required("End time required"),
  price: Yup.number()
    .typeError("Price must be a number")
    .required("Price is required"),
});

const AdminEvent: React.FunctionComponent<PropsType> = ({
  show,
  onHide,
  venueId,
  event,
}) => {
  let defaultValues: Partial<EventInput> = {};
  if (event) {
    defaultValues = {
      name: event.name,
      description: event.description,
      start_date: dayjs.unix(event.start_utc_seconds).format("YYYY-MM-DD"),
      start_time: dayjs.unix(event.start_utc_seconds).format("HH:mm"),
      end_date: dayjs
        .unix(event.start_utc_seconds)
        .add(event.duration_minutes, "minute")
        .format("YYYY-MM-DD"),
      end_time: dayjs
        .unix(event.start_utc_seconds)
        .add(event.duration_minutes, "minute")
        .format("HH:mm"),
      price: event.price / 100,
    };
  }
  const { register, handleSubmit, errors, formState } = useForm<EventInput>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    validationSchema,
    defaultValues,
  });

  const onSubmit = useCallback(
    async (data: EventInput) => {
      const start = dayjs(`${data.start_date} ${data.start_time}`);
      const end = dayjs(`${data.end_date} ${data.end_time}`);
      const formEvent: Omit<VenueEvent, "id"> = {
        name: data.name,
        description: data.description,
        start_utc_seconds: start.unix(),
        duration_minutes: end.diff(start, "minute"),
        price: Math.floor(data.price * 100),
        collective_price: 0,
      };
      if (event) {
        await updateEvent(venueId, event.id, formEvent);
      } else {
        await createEvent(venueId, formEvent);
      }
      onHide();
    },
    [onHide, venueId]
  );
  return (
    <Modal show={show} onHide={onHide}>
      <div className="form-container">
        <h2>Create an event</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <div className="input-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              className="input-block input-centered"
              placeholder="Name"
              ref={register}
            />
            {errors.name && (
              <span className="input-error">{errors.name.message}</span>
            )}
          </div>
          <div className="input-group">
            <label htmlFor="description">Description</label>
            <textarea
              name="description"
              className="input-block input-centered"
              placeholder="Description"
              ref={register}
            />
            {errors.description && (
              <span className="input-error">{errors.description.message}</span>
            )}
          </div>
          <div className="input-group">
            <label>Start Time</label>
            <input
              type="date"
              min={dayjs().format("YYYY-MM-DD")}
              name="start_date"
              className="input-block input-centered"
              ref={register}
            />
            {errors.start_date && (
              <span className="input-error">{errors.start_date.message}</span>
            )}
            <input
              type="time"
              name="start_time"
              className="input-block input-centered"
              ref={register}
            />
            {errors.start_time && (
              <span className="input-error">{errors.start_time.message}</span>
            )}
          </div>
          <div className="input-group">
            <label>End Time</label>
            <input
              type="date"
              min={dayjs().format("YYYY-MM-DD")}
              name="end_date"
              className="input-block input-centered"
              ref={register}
            />
            {errors.end_date && (
              <span className="input-error">{errors.end_date.message}</span>
            )}
            <input
              type="time"
              name="end_time"
              className="input-block input-centered"
              placeholder="Time"
              ref={register}
            />
            {errors.end_time && (
              <span className="input-error">{errors.end_time.message}</span>
            )}
          </div>
          <div className="input-group">
            <label htmlFor="price">Price</label>
            <input
              id="price"
              name="price"
              className="input-block input-centered"
              placeholder="£20"
              ref={register}
            />
            {errors.price && (
              <span className="input-error">{errors.price.message}</span>
            )}
          </div>
          <input
            className="btn btn-primary btn-block btn-centered"
            type="submit"
            value="Create"
            disabled={formState.isSubmitting}
          />
        </form>
      </div>
    </Modal>
  );
};

export default AdminEvent;
