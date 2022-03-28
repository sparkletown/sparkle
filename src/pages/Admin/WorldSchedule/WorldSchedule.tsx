import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useAsyncFn } from "react-use";
import { yupResolver } from "@hookform/resolvers/yup";
import { AdminRestrictedLoading } from "components/admin/AdminRestrictedLoading";
import { AdminRestrictedMessage } from "components/admin/AdminRestrictedMessage";
import { Button } from "components/admin/Button";
import { EventsPanel } from "components/admin/EventsPanel";
import { Header } from "components/admin/Header";
import { HeaderButton } from "components/admin/HeaderButton";
import { Input } from "components/admin/Input";
import { AdminLayout } from "components/layouts/AdminLayout";
import { WithPermission } from "components/shared/WithPermission";

import { updateWorldScheduleSettings } from "api/world";

import { WorldWithId } from "types/id";
import { WorldScheduleFormInput } from "types/world";

import {
  convertDateFromUtcSeconds,
  convertUtcSecondsFromInputDateAndTime,
} from "utils/time";

import { worldScheduleSchema } from "forms/worldScheduleSchema";

import { useWorldSpaces } from "hooks/spaces/useWorldSpaces";
import { useShowHide } from "hooks/useShowHide";

import { TimingEventModal } from "components/organisms/TimingEventModal";

import * as TW from "./WorldSchedule.tailwind";

export interface WorldScheduleProps {
  world: WorldWithId;
}

export const WorldSchedule: React.FC<WorldScheduleProps> = ({ world }) => {
  const {
    isShown: isShownCreateEventModal,
    show: showCreateEventModal,
    hide: hideCreateEventModal,
  } = useShowHide();

  const { spaces } = useWorldSpaces({ worldId: world.id });

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
    formState: { isSubmitting },
    register,
    handleSubmit,
  } = useForm<WorldScheduleFormInput>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    resolver: yupResolver(worldScheduleSchema),
    defaultValues,
  });

  const [{ loading: isSaving }, submit] = useAsyncFn(
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

  const isSaveLoading = isSubmitting || isSaving;

  return (
    <WithPermission
      check="world"
      loading={<AdminRestrictedLoading />}
      fallback={<AdminRestrictedMessage />}
    >
      <AdminLayout>
        <Header title="World Schedule">
          <HeaderButton
            name="Create new experience"
            variant="multicolor"
            onClick={showCreateEventModal}
          />
        </Header>
        <div className={TW.content}>
          <div className={TW.formSection}>
            <form onSubmit={handleSubmit(submit)}>
              <section className="xl:col-start-1 xl:col-span-1">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">
                    Global starting time
                  </h2>
                  <p className="text-sm mt-2 mb-7">
                    When does your event start? Use your local time zone, it
                    will be automatically converted for anyone visiting from
                    around the world.
                  </p>
                  <div className="flow-root">
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700">
                        Starting time for schedule
                      </label>
                      <div className="flex row justify-between">
                        <Input
                          type="date"
                          name="startDate"
                          register={register}
                        />
                        <Input
                          type="time"
                          name="startTime"
                          register={register}
                        />
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700">
                        Ending time for schedule
                      </label>
                      <div className="flex row justify-between">
                        <Input type="date" name="endDate" register={register} />
                        <Input type="time" name="endTime" register={register} />
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <Button variant="secondary">Cancel</Button>

              <Button type="submit" disabled={isSaveLoading} variant="primary">
                {isSaveLoading ? "Saving..." : "Save"}
              </Button>
            </form>
          </div>

          <EventsPanel worldId={world.id} spaces={spaces} />
        </div>
        {isShownCreateEventModal && (
          <TimingEventModal
            show={isShownCreateEventModal}
            onHide={hideCreateEventModal}
            worldId={world.id}
          />
        )}
      </AdminLayout>
    </WithPermission>
  );
};
