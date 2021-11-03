import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useAsyncFn } from "react-use";
import * as Yup from "yup";
import { TestFunction } from "yup";

import { updateVenue_v2 } from "api/admin";

import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";
import {
  convertDateFromUtcSeconds,
  convertUtcSecondsFromInputDateAndTime,
} from "utils/time";

import { useUser } from "hooks/useUser";

import { AdminSidebarFooterProps } from "components/organisms/AdminVenueView/components/AdminSidebarFooter/AdminSidebarFooter";

import { AdminDateTime } from "components/molecules/AdminDateTime";
import { AdminSection } from "components/molecules/AdminSection";
import { FormErrors } from "components/molecules/FormErrors";
import { SubmitError } from "components/molecules/SubmitError";

import { ButtonNG } from "components/atoms/ButtonNG";

// NOTE: add the keys of those errors that their respective fields have handled
const HANDLED_ERRORS: string[] = [
  "start",
  "startDate",
  "startTime",
  "end",
  "endDate",
  "endTime",
];

export interface SpaceTimingFormInput {
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
}

const testEndDate: TestFunction = function testEndIsAfterStart() {
  const { startDate, endDate } = this.parent;

  const zeroHour = "00:00";
  const start = convertUtcSecondsFromInputDateAndTime({
    date: startDate,
    time: zeroHour,
  });
  const end = convertUtcSecondsFromInputDateAndTime({
    date: endDate,
    time: zeroHour,
  });

  return start <= end;
};

const testEndTime: TestFunction = function testEndIsAfterStart() {
  const { endTime, startTime, startDate, endDate } = this.parent;

  const start = convertUtcSecondsFromInputDateAndTime({
    date: startDate,
    time: startTime,
  });
  const end = convertUtcSecondsFromInputDateAndTime({
    date: endDate,
    time: endTime,
  });

  return start < end;
};

const validationSchema = Yup.object().shape({
  startDate: Yup.string()
    .required()
    .test(
      "startDate",
      "Start date must not be after the end date",
      testEndDate
    ),
  startTime: Yup.string()
    .required()
    .test("startTime", "Start time must be before the end time", testEndTime),
  endDate: Yup.string()
    .required()
    .test(
      "endDate",
      "End date must not be before the starting date",
      testEndDate
    ),
  endTime: Yup.string()
    .required()
    .test("endTime", "End time must be after the start time", testEndTime),
});

export interface SpaceTimingFormProps extends AdminSidebarFooterProps {
  venue: WithId<AnyVenue>;
}

export const SpaceTimingForm: React.FC<SpaceTimingFormProps> = ({ venue }) => {
  const { user } = useUser();

  const defaultValues = useMemo<SpaceTimingFormInput>(() => {
    const {
      inputFormattedDateSegment: startDate,
      inputFormattedTimeSegment: startTime,
    } = convertDateFromUtcSeconds(venue.start_utc_seconds ?? NaN);

    const {
      inputFormattedDateSegment: endDate,
      inputFormattedTimeSegment: endTime,
    } = convertDateFromUtcSeconds(venue.end_utc_seconds ?? NaN);

    return {
      startTime,
      startDate,
      endTime,
      endDate,
    };
  }, [venue.start_utc_seconds, venue.end_utc_seconds]);

  const {
    reset,
    formState: { dirty, isSubmitting },
    register,
    errors,
    handleSubmit,
  } = useForm<SpaceTimingFormInput>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    validationSchema,
    defaultValues,
  });

  const [{ error, loading: isSaving }, submit] = useAsyncFn(
    async (input: SpaceTimingFormInput) => {
      if (!venue.name || !user) return;

      await updateVenue_v2(
        {
          name: venue.name,
          worldId: venue.worldId,
          start_utc_seconds: convertUtcSecondsFromInputDateAndTime({
            date: input.startDate,
            time: input.startTime,
          }),
          end_utc_seconds: convertUtcSecondsFromInputDateAndTime({
            date: input.endDate,
            time: input.endTime,
          }),
        },
        user
      );

      reset(input);
    },
    [venue, user, reset]
  );

  const isSaveLoading = isSubmitting || isSaving;
  const isSaveDisabled = !(
    // Useful if form has mode: "onChange"
    // Object.keys(errors).length ||
    (dirty || isSaving || isSubmitting)
  );

  return (
    <div className="SpaceTimingForm">
      <form onSubmit={handleSubmit(submit)}>
        <AdminSection>
          <AdminDateTime
            name="start"
            register={register}
            errors={errors}
            label="Global starting time"
            supertext={
              <>
                When does your event start? Use your local time zone, it will be
                automatically converted for anyone visiting from around the
                world.
              </>
            }
          />
        </AdminSection>

        <AdminSection>
          <AdminDateTime
            name="end"
            register={register}
            errors={errors}
            label="Global ending time"
          />
        </AdminSection>

        <FormErrors errors={errors} omitted={HANDLED_ERRORS} />
        <SubmitError error={error} />

        <ButtonNG
          type="submit"
          disabled={isSaveDisabled}
          loading={isSaveLoading}
          variant="primary"
        >
          Save changes
        </ButtonNG>
      </form>
    </div>
  );
};
