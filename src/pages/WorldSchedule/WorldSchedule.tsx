import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useAsyncFn } from "react-use";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import { ADMIN_IA_WORLD_PARAM_URL } from "settings";

import { updateWorldScheduleSettings } from "api/world";

import {
  convertDateFromUtcSeconds,
  convertUtcSecondsFromInputDateAndTime,
} from "utils/time";
import { generateUrl } from "utils/url";

import { worldScheduleSchema } from "forms/worldScheduleSchema";

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
    } = convertDateFromUtcSeconds(world?.startTimeUnix ?? 0);

    const {
      inputFormattedDateSegment: endDate,
      inputFormattedTimeSegment: endTime,
    } = convertDateFromUtcSeconds(world?.endTimeUnix ?? 0);

    return {
      startTime,
      startDate,
      endTime,
      endDate,
    };
  }, [world?.startTimeUnix, world?.endTimeUnix]);

  const {
    reset,
    formState: { dirty, isSubmitting },
    register,
    errors,
    handleSubmit,
  } = useForm<WorldScheduleFormInput>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    validationSchema: worldScheduleSchema,
    defaultValues,
  });

  const [{ error, loading: isSaving }, submit] = useAsyncFn(
    async (input: WorldScheduleFormInput) => {
      if (!world?.name) return;

      await updateWorldScheduleSettings({
        id: world.id,
        startTimeUnix: convertUtcSecondsFromInputDateAndTime({
          date: input.startDate,
          time: input.startTime,
        }),
        endTimeUnix: convertUtcSecondsFromInputDateAndTime({
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
          <EventsView variant="world" worldId={world.id} />
        </AdminShowcase>
      </AdminPanel>
    </>
  );
};
