import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useAsyncFn } from "react-use";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import * as Yup from "yup";
import { TestFunction } from "yup";

import { ADMIN_IA_WORLD_PARAM_URL } from "settings";

import { updateWorldScheduleSettings } from "api/world";

import { EventsVariant } from "types/events";

import {
  convertDateFromUtcSeconds,
  convertUtcSecondsFromInputDateAndTime,
} from "utils/time";
import { generateUrl } from "utils/url";

import { useWorldBySlug } from "hooks/worlds/useWorldBySlug";
import { useWorldParams } from "hooks/worlds/useWorldParams";

import { AdminPanel } from "components/organisms/AdminVenueView/components/AdminPanel";
import { AdminShowcase } from "components/organisms/AdminVenueView/components/AdminShowcase";
import { AdminSidebar } from "components/organisms/AdminVenueView/components/AdminSidebar";
import { EventsView } from "components/organisms/AdminVenueView/components/EventsView";

import { AdminDateTime } from "components/molecules/AdminDateTime";
import { AdminSection } from "components/molecules/AdminSection";
import { AdminTitle } from "components/molecules/AdminTitle";
import { AdminTitleBar } from "components/molecules/AdminTitleBar";
import { FormErrors } from "components/molecules/FormErrors";
import { LoadingPage } from "components/molecules/LoadingPage";
import { SubmitError } from "components/molecules/SubmitError";

import { ButtonNG } from "components/atoms/ButtonNG";
import { NotFound } from "components/atoms/NotFound";

import "./WorldSchedule.scss";

const HANDLED_ERRORS: string[] = [
  "start",
  "startDate",
  "startTime",
  "end",
  "endDate",
  "endTime",
];

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

export interface WorldScheduleFormInput {
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
}

export const WorldSchedule = () => {
  const { worldSlug } = useWorldParams();
  const { isLoaded, world } = useWorldBySlug(worldSlug);

  const defaultValues = useMemo<WorldScheduleFormInput>(() => {
    const {
      inputFormattedDateSegment: startDate,
      inputFormattedTimeSegment: startTime,
    } = convertDateFromUtcSeconds(world?.startTimeUTC ?? NaN);

    const {
      inputFormattedDateSegment: endDate,
      inputFormattedTimeSegment: endTime,
    } = convertDateFromUtcSeconds(world?.endTimeUTC ?? NaN);

    return {
      startTime,
      startDate,
      endTime,
      endDate,
    };
  }, [world?.startTimeUTC, world?.endTimeUTC]);

  const {
    reset,
    formState: { dirty, isSubmitting },
    register,
    errors,
    handleSubmit,
  } = useForm<WorldScheduleFormInput>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    validationSchema,
    defaultValues,
  });

  const [{ error, loading: isSaving }, submit] = useAsyncFn(
    async (input: WorldScheduleFormInput) => {
      if (!world?.name) return;

      await updateWorldScheduleSettings({
        id: world.id,
        startTimeUTC: convertUtcSecondsFromInputDateAndTime({
          date: input.startDate,
          time: input.startTime,
        }),
        endTimeUTC: convertUtcSecondsFromInputDateAndTime({
          date: input.endDate,
          time: input.endTime,
        }),
      });

      reset(input);
    },
    [world, reset]
  );

  if (!isLoaded) {
    return <LoadingPage />;
  }

  if (!world) {
    return <NotFound />;
  }

  const homeUrl = generateUrl({
    route: ADMIN_IA_WORLD_PARAM_URL,
    required: ["worldSlug"],
    params: { worldSlug },
  });

  const isSaveLoading = isSubmitting || isSaving;
  const isSaveDisabled = !(
    // Useful if form has mode: "onChange"
    // Object.keys(errors).length ||
    (dirty || isSaving || isSubmitting)
  );

  return (
    <>
      <AdminTitleBar variant="grid-with-tools">
        <ButtonNG
          variant="secondary"
          isLink
          linkTo={homeUrl}
          iconName={faArrowLeft}
        >
          Back to dashboard
        </ButtonNG>
        <AdminTitle>World schedule</AdminTitle>
        <ButtonNG variant="admin-gradient">Create new experience</ButtonNG>
      </AdminTitleBar>
      <AdminPanel variant="bound" className="WorldSchedule">
        <AdminSidebar>
          <form onSubmit={handleSubmit(submit)}>
            <AdminSection>
              <AdminDateTime
                name="start"
                register={register}
                errors={errors}
                label="Global starting time"
                supertext={
                  <>
                    When does your event start? Use your local time zone, it
                    will be automatically converted for anyone visiting from
                    around the world.
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
        </AdminSidebar>
        <AdminShowcase>
          <EventsView variant={EventsVariant.world} worldId={world.id} />
        </AdminShowcase>
      </AdminPanel>
    </>
  );
};
