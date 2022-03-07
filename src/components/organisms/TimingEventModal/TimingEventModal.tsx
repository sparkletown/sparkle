import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useForm, useFormState } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "components/admin/Button";
import { Input } from "components/admin/Input";
import { Textarea } from "components/admin/Textarea";
import dayjs from "dayjs";

import { DAYJS_INPUT_DATE_FORMAT, DAYJS_INPUT_TIME_FORMAT } from "settings";

import { createEvent, EventInput, updateEvent } from "api/admin";

import { WorldId } from "types/id";
import { SpaceType } from "types/spaces";
import { AnyVenue, WorldEvent } from "types/venues";
import { VenueTemplate } from "types/VenueTemplate";

import { MaybeWithId, WithId } from "utils/id";

import { eventEditSchema } from "forms/eventEditSchema";

import { useSpacesByOwner } from "hooks/spaces/useSpacesByOwner";
import { useUserId } from "hooks/user/useUserId";

import { LoadingPage } from "components/molecules/LoadingPage";
import { Modal } from "components/molecules/Modal";

import { Dropdown } from "components/atoms/Dropdown";

import "./TimingEventModal.scss";

type TimingEventModalProps = {
  show: boolean;
  onHide: () => void;
  venueId?: string | undefined;
  event?: WorldEvent;
  template?: VenueTemplate;
  venue?: WithId<AnyVenue>;
  worldId?: WorldId;
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
    name: "",
  });

  const eventSpaceId = event?.spaceId || venue?.id;

  const {
    register,
    handleSubmit,
    control,
    formState,
    reset,
  } = useForm<EventInput>({
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
        start_date: dayjs
          .unix(event.startUtcSeconds)
          .format(DAYJS_INPUT_DATE_FORMAT),
        start_time: dayjs
          .unix(event.startUtcSeconds)
          .format(DAYJS_INPUT_TIME_FORMAT),
        duration_hours: Math.floor(event.durationMinutes / 60),
        duration_minutes: event.durationMinutes % 60,
        host: event.host,
      });
    }
  }, [event, reset, eventSpaceId]);

  const { userId } = useUserId();
  const {
    ownSpaces: ownedVenues,
    isLoading: isSpacesLoading,
  } = useSpacesByOwner({
    worldId,
    userId,
  });

  const spacesMap: SpaceType[] = ownedVenues.map((venue) => ({
    id: venue.id,
    name: venue.name,
  }));

  const renderedSpaceIds = useMemo(
    () =>
      spacesMap.map((space) => {
        return (
          <div key={space.id} onClick={() => setSelectedSpace(space)}>
            {space.name}
          </div>
        );
      }) ?? [],
    [spacesMap]
  );

  const onUpdateEvent = useCallback(
    async (data: EventInput) => {
      const updatedWorldId: string | undefined = eventSpace?.worldId ?? worldId;
      if (!updatedWorldId) return;
      const start = dayjs(`${data.start_date} ${data.start_time}`);
      const spaceId = eventSpaceId ?? selectedSpace.id ?? "";
      const formEvent: MaybeWithId<WorldEvent> = {
        name: data.name,
        description: data.description,
        startUtcSeconds:
          start.unix() || Math.floor(new Date().getTime() / 1000),
        durationMinutes:
          data.duration_hours * 60 + (data.duration_minutes ?? 0),
        host: data.host,
        spaceId: spaceId,
        // @debt this needs figuring out. We shouldn't get to here without
        // an eventSpace
        worldId: updatedWorldId,
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

  return (
    <Modal show={show} onHide={onHide} centered autoHide>
      <div className="TimingEventModal form-container">
        <h2>Add experience</h2>
        <form className="form" onSubmit={handleSubmit(onUpdateEvent)}>
          <p>Your experience is in {eventSpace?.name}</p>

          {!eventSpace?.name && (
            <>
              <div className="mb-6">
                <Dropdown title={"None"}>{renderedSpaceIds}</Dropdown>
              </div>
              {errors.space && (
                <span className="text-red-500">
                  {errors.space.name?.message}
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
                  min={dayjs().format(DAYJS_INPUT_DATE_FORMAT)}
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

          <div className="TimingEventModal__container">
            <Button variant="secondary" onClick={onHide}>
              Cancel
            </Button>

            <Button
              disabled={formState.isSubmitting}
              variant="primary"
              type="submit"
            >
              {event?.id ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
