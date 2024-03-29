import React, { useEffect, useState } from "react";
import { useForm, useFormState } from "react-hook-form";
import { useAsyncFn } from "react-use";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "components/admin/Button";
import { Dropdown } from "components/admin/Dropdown";
import { Option } from "components/admin/Dropdown/Dropdown";
import { Input } from "components/admin/Input";
import { Textarea } from "components/admin/Textarea";
import { format, fromUnixTime, getUnixTime } from "date-fns";

import { DATEFNS_INPUT_DATE_FORMAT, DATEFNS_INPUT_TIME_FORMAT } from "settings";

import { createEvent, EventInput, updateEvent } from "api/admin";

import { SpaceId, SpaceWithId, WorldId } from "types/id";
import { SpaceType } from "types/spaces";
import { WorldEvent } from "types/venues";
import { VenueTemplate } from "types/VenueTemplate";

import { MaybeWithId } from "utils/id";
import { fromStringToDate } from "utils/time";

import { eventEditSchema } from "forms/eventEditSchema";

import { useOwnedVenues } from "hooks/useOwnedVenues";
import { useUserId } from "hooks/user/useUserId";

import { LoadingPage } from "components/molecules/LoadingPage";
import { Modal } from "components/molecules/Modal";

export type TimingEventModalProps = {
  show: boolean;
  onHide: () => void;
  venueId?: string | undefined;
  event?: WorldEvent;
  template?: VenueTemplate;
  venue?: SpaceWithId;
  worldId: WorldId | string;
};

export const TimingEventModal: React.FC<TimingEventModalProps> = ({
  show,
  onHide,
  venue,
  event,
  worldId,
}) => {
  const [selectedSpace, setSelectedSpace] = useState<SpaceType>({
    id: "",
    label: "",
  });

  const eventSpaceId = event?.spaceId || (venue?.id as SpaceId | undefined);

  const { register, handleSubmit, control, reset } = useForm<EventInput>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    resolver: yupResolver(eventEditSchema),
    context: {
      eventSpaceId,
      selectedSpace,
    },
  });

  const { errors } = useFormState({ control });
  const eventSpace = venue;
  useEffect(() => {
    if (event?.id) {
      reset({
        name: event.name,
        description: event.description,
        start_date: format(
          fromUnixTime(event.startUtcSeconds),
          DATEFNS_INPUT_DATE_FORMAT
        ),
        start_time: format(
          fromUnixTime(event.startUtcSeconds),
          DATEFNS_INPUT_TIME_FORMAT
        ),
        duration_hours: Math.floor(event.durationMinutes / 60),
        duration_minutes: event.durationMinutes % 60,
        host: event.host,
      });
    }
  }, [event, reset, eventSpaceId]);

  const { userId } = useUserId();
  const { ownedVenues, isLoading: isSpacesLoading } = useOwnedVenues({
    worldId,
    userId: userId ?? "",
  });

  const spacesOptions: SpaceType[] = ownedVenues.map((venue) => ({
    id: venue.id,
    label: venue.name,
  }));

  const renderOption = (space: SpaceType) => (
    <div key={space.id} data-dropdown-value={space}>
      {space.label}
    </div>
  );

  const selectSpace = (option: Option) => {
    setSelectedSpace(option as SpaceType);
  };

  const [{ loading: isLoading }, onUpdateEvent] = useAsyncFn(
    async (data: EventInput) => {
      const start = fromStringToDate(`${data.start_date} ${data.start_time}`);
      const spaceId = eventSpaceId ?? selectedSpace.id ?? "";
      const formEvent: MaybeWithId<WorldEvent> = {
        name: data.name,
        description: data.description,
        startUtcSeconds: getUnixTime(start) || getUnixTime(Date.now()),
        durationMinutes:
          data.duration_hours * 60 + (data.duration_minutes ?? 0),
        host: data.host,
        spaceId: spaceId as SpaceId,
        // @debt this needs figuring out. We shouldn't get to here without
        // an eventSpace
        worldId: eventSpace?.worldId ?? worldId,
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
      eventSpaceId,
      selectedSpace.id,
      eventSpace?.worldId,
      worldId,
      onHide,
      event?.id,
    ]
  );

  if (isSpacesLoading) {
    return <LoadingPage />;
  }

  const updateLabel = isLoading ? "Updating..." : "Update";
  const createLabel = isLoading ? "Creating..." : "Create";

  return (
    <Modal show={show} onHide={onHide} centered autoHide>
      <div className="TimingEventModal form-container">
        <h2>Add experience</h2>
        <form className="form" onSubmit={handleSubmit(onUpdateEvent)}>
          <p>Your experience is in {eventSpace?.name}</p>

          {!eventSpace?.name && (
            <>
              <div className="mb-6">
                <Dropdown
                  onSelect={selectSpace}
                  options={spacesOptions}
                  renderOption={renderOption}
                  title="None"
                />
              </div>
              {errors.space && (
                <span className="text-red-500">
                  {errors.space.label?.message}
                </span>
              )}
            </>
          )}

          <div className="mb-6">
            <label htmlFor="name">Name your experience</label>
            <Input
              type="text"
              placeholder="Name"
              errors={errors}
              register={register}
              name="name"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="description">Describe your experience</label>
            <Textarea
              name="description"
              placeholder="Description"
              errors={errors}
              register={register}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="host">Host (people hosting the event)</label>
            <Input
              type="text"
              placeholder="Dottie Longstockings"
              errors={errors}
              register={register}
              name="host"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="date">
              Start date and time (use your own time zone; it will be
              automatically localized)
            </label>
            <div className="TimingEventModal__container">
              {/*
                  These wrapper divs are here to unmuddle some precedance issues
                  in the CSS that causes the inputs to have 100% width. This
                  form is going to have some layout changes applied that should
                  resolve this..
                  */}
              <div>
                <Input
                  type="date"
                  min={format(Date.now(), DATEFNS_INPUT_DATE_FORMAT)}
                  placeholder="Dottie Longstockings"
                  errors={errors}
                  register={register}
                  name="start_date"
                />
              </div>
              <div>
                <Input
                  type="time"
                  errors={errors}
                  register={register}
                  name="start_time"
                />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label>Duration</label>
            <div className="flex flex-row">
              <Input
                placeholder="hours"
                errors={errors}
                register={register}
                name="duration_hours"
              />
              <label className="self-center px-1" htmlFor="duration_hours">
                hour(s)
              </label>
              <Input
                placeholder="minutes"
                errors={errors}
                register={register}
                name="duration_minutes"
              />
              <label className="self-center px-1" htmlFor="duration_minutes">
                minutes
              </label>
            </div>
          </div>

          <div className="flex">
            <Button variant="secondary" onClick={onHide}>
              Cancel
            </Button>

            <Button
              disabled={isLoading}
              loading={isLoading}
              variant="primary"
              type="submit"
            >
              {event?.id ? updateLabel : createLabel}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
