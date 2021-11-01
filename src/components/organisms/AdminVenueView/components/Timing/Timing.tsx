import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useAsyncFn } from "react-use";
import * as Yup from "yup";

import { updateVenue_v2 } from "api/admin";

import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";

import { useUser } from "hooks/useUser";

import { AdminPanel } from "components/organisms/AdminVenueView/components/AdminPanel";
import { AdminShowcase } from "components/organisms/AdminVenueView/components/AdminShowcase";
import { AdminSidebar } from "components/organisms/AdminVenueView/components/AdminSidebar";
import {
  AdminSidebarFooter,
  AdminSidebarFooterProps,
} from "components/organisms/AdminVenueView/components/AdminSidebarFooter/AdminSidebarFooter";
import { AdminSidebarTitle } from "components/organisms/AdminVenueView/components/AdminSidebarTitle";

import { FormErrors } from "components/molecules/FormErrors";
import { LoadingPage } from "components/molecules/LoadingPage";

import { DateTimeField } from "../DateTimeField";
import { EventsView } from "../EventsView";

import "./Timing.scss";

interface TimingProps extends AdminSidebarFooterProps {
  venue?: WithId<AnyVenue>;
}

export const roomEditSchema = Yup.object().shape({
  startTime: Yup.number().required(),
  endTime: Yup.number()
    .required()
    .moreThan(Yup.ref("startTime"), "End time must always be after start time"),
});

export const Timing: React.FC<TimingProps> = ({
  venue,
  ...sidebarFooterProps
}) => {
  const { user } = useUser();
  const {
    register,
    handleSubmit,
    errors,
    triggerValidation,
    formState: { isSubmitting },
  } = useForm({
    mode: "onChange",
    validationSchema: roomEditSchema,
    defaultValues: {
      startTime: venue?.start_utc_seconds,
      endTime: venue?.end_utc_seconds,
    },
  });

  const [startUtcSeconds, setStartUtcSeconds] = useState(
    venue?.start_utc_seconds
  );
  const [endUtcSeconds, setEndUtcSeconds] = useState(venue?.end_utc_seconds);

  useEffect(() => {
    triggerValidation("endTime");
  }, [endUtcSeconds, startUtcSeconds, triggerValidation]);

  const [{ loading: isSaving }, handleVenueUpdate] = useAsyncFn(async () => {
    if (!venue?.name || !user) return;

    updateVenue_v2(
      {
        start_utc_seconds: startUtcSeconds,
        end_utc_seconds: endUtcSeconds,
        name: venue?.name,
        worldId: venue?.worldId,
      },
      user
    ).catch((e) => console.error(Timing.name, e));
  }, [venue, user, startUtcSeconds, endUtcSeconds]);

  if (!venue) {
    return <LoadingPage />;
  }

  const isSaveDisabled =
    !!Object.entries(errors).length || isSubmitting || isSaving;

  return (
    <AdminPanel className="Timing">
      <AdminSidebar>
        <AdminSidebarTitle>Plan your event</AdminSidebarTitle>
        <AdminSidebarFooter
          {...sidebarFooterProps}
          onClickSave={handleSubmit(handleVenueUpdate)}
          disabled={isSaveDisabled}
        />
        <Form className="Timing__content">
          <DateTimeField
            title="Global starting time"
            subTitle="When does your event start? Use your local time zone, it will be automatically converted for anyone visiting from around the world."
            dateTimeValue={startUtcSeconds}
            onChange={setStartUtcSeconds}
            name="startTime"
            ref={register}
          />
          <DateTimeField
            title="Global ending time"
            dateTimeValue={endUtcSeconds}
            onChange={setEndUtcSeconds}
            name="endTime"
            ref={register}
          />
          <FormErrors errors={errors} />
        </Form>
      </AdminSidebar>
      <AdminShowcase className="Timing__events-wrapper">
        <EventsView venueId={venue.id} venue={venue} />
      </AdminShowcase>
    </AdminPanel>
  );
};
