import React from "react";
import { useForm } from "react-hook-form";
import firebase from "firebase/app";
import { VenueEvent } from "types/VenueEvent";
import dayjs from "dayjs";
import * as Yup from "yup";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
dayjs.extend(isSameOrAfter);

interface PropsType {
  venueId: string;
  onComplete: () => void;
}

interface CreateEventFormData {
  name: string;
  description: string;
  start_date: string;
  start_time: string;
  end_date: string;
  end_time: string;
  price: number;
}

const postEvent = async (venueId: string, event: Omit<VenueEvent, "id">) => {
  await firebase.firestore().collection(`venues/${venueId}/events`).add(event);
};

const validationSchema = Yup.object().shape<CreateEventFormData>({
  name: Yup.string().required("Name required"),
  description: Yup.string().required("Description required"),
  start_date: Yup.string()
    .required("Start date required")
    .matches(
      /\d{4}-\d{2}-\d{2}/,
      'Start date must have the format "yyyy-mm-dd"'
    )
    .test(
      "start_date_futur",
      "Start date must be in the futur",
      (start_date) => {
        return dayjs(start_date).isSameOrAfter(dayjs(), "day");
      }
    ),
  start_time: Yup.string().required("Start time required"),
  end_date: Yup.string()
    .required("End date required")
    .test("end_date_futur", "End date must be in the futur", (end_date) => {
      return dayjs(end_date).isSameOrAfter(dayjs(), "day");
    }),
  end_time: Yup.string().required("End time required"),
  price: Yup.number()
    .typeError("Price must be a number")
    .required("Price is required"),
});

const CreateEventForm: React.FunctionComponent<PropsType> = ({
  venueId,
  onComplete,
}) => {
  const { register, handleSubmit, errors, formState } = useForm<
    CreateEventFormData
  >({
    mode: "onChange",
    validationSchema,
  });
  const onSubmit = async (data: CreateEventFormData) => {
    const start = dayjs(`${data.start_date} ${data.start_time}`);
    const end = dayjs(`${data.end_date} ${data.end_time}`);
    const event: Omit<VenueEvent, "id"> = {
      name: data.name,
      description: data.description,
      start_utc_seconds: start.unix(),
      duration_minutes: end.diff(start, "minute"),
      price: Math.floor(data.price * 100),
      collective_price: 0,
    };
    await postEvent(venueId, event);
    onComplete();
  };

  return (
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
          disabled={!formState.isValid}
        />
      </form>
    </div>
  );
};

export default CreateEventForm;
