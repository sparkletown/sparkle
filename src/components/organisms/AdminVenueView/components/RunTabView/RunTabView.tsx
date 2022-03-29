import React, { useMemo } from "react";
import { useForm, useFormState } from "react-hook-form";
import { useAsyncFn } from "react-use";
import { yupResolver } from "@hookform/resolvers/yup";
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

import { announcementSchema } from "forms/announcementSchema";

import { AdminShowcase } from "components/organisms/AdminVenueView/components/AdminShowcase";
import { AdminSidebar } from "components/organisms/AdminVenueView/components/AdminSidebar";

import { LoadingPage } from "components/molecules/LoadingPage";

import { MapPreview } from "../MapPreview";

export interface RunTabViewProps {
  space?: SpaceWithId;
}

export const RunTabView: React.FC<RunTabViewProps> = ({ space }) => {
  const defaultValues = useMemo(
    () => ({
      content: space?.banner?.content ?? "",
      buttonDisplayText: space?.banner?.buttonDisplayText ?? "",
      buttonUrl: space?.banner?.buttonUrl ?? "",
      isFullScreen: space?.banner?.isFullScreen ?? false,
      isForceFunnel: space?.banner?.isForceFunnel ?? false,
      isActionButton: space?.banner?.isActionButton ?? false,
    }),
    [
      space?.banner?.buttonDisplayText,
      space?.banner?.buttonUrl,
      space?.banner?.content,
      space?.banner?.isActionButton,
      space?.banner?.isForceFunnel,
      space?.banner?.isFullScreen,
    ]
  );

  const { register, control, watch } = useForm({
    reValidateMode: "onChange",
    defaultValues,
    resolver: yupResolver(announcementSchema),
  });

  const { errors } = useFormState({ control });

  const values = watch();

  const [{ loading: isUpdating }, updateAnnouncement] = useAsyncFn(async () => {
    if (!space) {
      return;
    }

    const banner = {
      content: values.content,
      isActionButton: values.isActionButton,
      buttonUrl: values.buttonUrl,
      buttonDisplayText: values.buttonDisplayText,
      isFullScreen: values.isFullScreen,
      isForceFunnel: values.isForceFunnel,
    };

    await updateBanner({ venueId: space.id, banner: banner });
  }, [
    space,
    values.buttonDisplayText,
    values.buttonUrl,
    values.content,
    values.isActionButton,
    values.isForceFunnel,
    values.isFullScreen,
  ]);

  if (!space) {
    return <LoadingPage />;
  }

  const mapBackground = space.mapBackgroundImageUrl;

  return (
    <ThreeColumnLayout>
      <AdminSidebar>
        <SidebarHeader>Announcements</SidebarHeader>

        <InputGroup title="Announcement content *">
          <Textarea
            placeholder="Please type your announcement text here."
            register={register}
            name="content"
            errors={errors}
          />
        </InputGroup>

        <Checkbox
          label="Set full-screen announcement"
          register={register}
          name="isFullScreen"
        />

        <Toggle
          register={register}
          name="isActionButton"
          checked={values.isActionButton}
          label="Call to action button"
        />

        <div className="pl-12">
          <InputGroup title="Button text">
            <Input
              placeholder="Button display text"
              register={register}
              name="buttonDisplayText"
              errors={errors}
            />
          </InputGroup>

          <InputGroup title="Button URL">
            <Input
              placeholder="Button URL"
              register={register}
              name="buttonUrl"
              errors={errors}
            />
          </InputGroup>
        </div>

        <Checkbox
          label="Force funnel"
          register={register}
          name="isForceFunnel"
        />

        <div className="flex justify-end">
          <Button variant="secondary">Cancel</Button>
          <Button disabled={isUpdating} onClick={updateAnnouncement}>
            Save
          </Button>
        </div>
      </AdminSidebar>

      <AdminShowcase>
        <MapPreview
          isEditing={false}
          mapBackground={mapBackground}
          rooms={[]}
          setSelectedRoom={() => undefined}
        />
      </AdminShowcase>
    </ThreeColumnLayout>
  );
};
