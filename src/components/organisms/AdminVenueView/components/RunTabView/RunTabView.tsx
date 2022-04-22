import React, { useMemo } from "react";
import { useForm, useFormState } from "react-hook-form";
import { useAsyncFn } from "react-use";
import { Button } from "components/admin/Button";
import { Checkbox } from "components/admin/Checkbox";
import { Input } from "components/admin/Input";
import { InputGroup } from "components/admin/InputGroup";
import { SidebarHeader } from "components/admin/SidebarHeader";
import { Textarea } from "components/admin/Textarea";
import { ThreeColumnLayout } from "components/admin/ThreeColumnLayout";
import { Toggle } from "components/admin/Toggle";

import { updateBanner } from "api/bannerAdmin";

import { SpaceWithId } from "types/id";

import { AdminShowcase } from "components/organisms/AdminVenueView/components/AdminShowcase";
import { AdminSidebar } from "components/organisms/AdminVenueView/components/AdminSidebar";

import { LoadingPage } from "components/molecules/LoadingPage";

export interface RunTabViewProps {
  space?: SpaceWithId;
}

export const RunTabView: React.FC<RunTabViewProps> = ({ space }) => {
  const spaceBanner = space?.banner;
  const spaceId = space?.id;

  const defaultValues = useMemo(
    () => ({
      content: spaceBanner?.content,
      isActionButton: spaceBanner?.isActionButton,
      buttonUrl: spaceBanner?.buttonUrl,
      buttonDisplayText: spaceBanner?.buttonDisplayText,
      isFullScreen: spaceBanner?.isFullScreen ?? true,
      isForceFunnel: spaceBanner?.isForceFunnel,
    }),
    [spaceBanner]
  );

  const { register, handleSubmit, watch, reset, control } = useForm({
    reValidateMode: "onChange",
    defaultValues,
  });

  const { isDirty } = useFormState({ control });

  const values = watch();

  const [{ loading: isUpdating }, updateVenue] = useAsyncFn(
    async (data) => {
      if (!spaceId) return;

      // FIXME: Remove auto-setting of isFullScreen once the non-fullscreen mode is implemented
      return updateBanner({ banner: { ...data, isFullScreen: true }, spaceId });
    },
    [spaceId]
  );

  if (!space) {
    return <LoadingPage />;
  }

  return (
    <ThreeColumnLayout>
      <AdminSidebar>
        <form onSubmit={handleSubmit(updateVenue)}>
          <SidebarHeader>Announcements</SidebarHeader>
          <InputGroup title="Announcement content" isRequired withLabel>
            <Textarea
              placeholder="Please type your announcement text here."
              register={register}
              name="content"
              required
            />
          </InputGroup>
          <Checkbox
            label="Set full-screen announcement"
            register={register}
            name="isFullScreen"
            disabled
            checked={values.isFullScreen}
          />
          <Toggle
            label="Call to action button"
            register={register}
            name="isActionButton"
            checked={values.isActionButton}
          />
          {values.isActionButton && (
            <>
              <InputGroup title="Button text" isRequired withLabel>
                <Input
                  placeholder="Button display text"
                  register={register}
                  name="buttonDisplayText"
                  required
                />
              </InputGroup>
              <InputGroup title="Button URL" isRequired withLabel>
                <Input
                  placeholder="Button URL"
                  register={register}
                  name="buttonUrl"
                  required
                />
              </InputGroup>
            </>
          )}

          <Checkbox
            label="Force funnel"
            register={register}
            name="isForceFunnel"
          />
          <div className="flex justify-end">
            <Button
              variant="secondary"
              onClick={() => reset()}
              disabled={!isDirty}
            >
              Cancel
            </Button>
            <Button disabled={isUpdating} loading={isUpdating} type="submit">
              {isUpdating ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </AdminSidebar>

      <AdminShowcase>
        <div className="px-12 sm:px-12">
          {/* A placeholder for a proper map preview. Once the non-fullscreen mode is designed */}
        </div>
      </AdminShowcase>
    </ThreeColumnLayout>
  );
};
