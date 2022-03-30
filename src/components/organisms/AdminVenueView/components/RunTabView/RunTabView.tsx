import React from "react";
import { useForm } from "react-hook-form";
import { Checkbox } from "components/admin/Checkbox";
import { HeaderButton } from "components/admin/HeaderButton";
import { Input } from "components/admin/Input";
import { InputGroup } from "components/admin/InputGroup";
import { SidebarHeader } from "components/admin/SidebarHeader";
import { Textarea } from "components/admin/Textarea";
import { ThreeColumnLayout } from "components/admin/ThreeColumnLayout";
import { Toggle } from "components/admin/Toggle";

import { SpaceWithId } from "types/id";

// import { MapPreview } from "../MapPreview";
import { MapPreview } from "pages/Admin/MapPreview";

import { AdminPanel } from "components/organisms/AdminVenueView/components/AdminPanel";
import { AdminShowcase } from "components/organisms/AdminVenueView/components/AdminShowcase";
import { AdminSidebar } from "components/organisms/AdminVenueView/components/AdminSidebar";

import { LoadingPage } from "components/molecules/LoadingPage";

export interface RunTabViewProps {
  space?: SpaceWithId;
}

const defaultValues = {
  fullscreen: true,
};

export const RunTabView: React.FC<RunTabViewProps> = ({ space }) => {
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    watch,
    control,
    reset,
  } = useForm({
    reValidateMode: "onChange",
    // resolver: yupResolver(spaceEditSchema),
    defaultValues,
  });

  if (!space) {
    return <LoadingPage />;
  }

  return (
    <ThreeColumnLayout>
      <AdminSidebar>
        <SidebarHeader>Announcements</SidebarHeader>
        <InputGroup title="Announcement content" isRequired withLabel>
          <Textarea
            placeholder="Please type your announcement text here."
            register={register}
            name="name"
            // errors={errors}
            // max={COMMON_NAME_MAX_CHAR_COUNT}
            required
          />
        </InputGroup>
        <Checkbox
          label="Set full-screen announcement"
          register={register}
          name="fullscreen"
          disabled
          checked
        />
        <Toggle
          label="Call to action button"
          register={register}
          name="callToAction"
        />
        <InputGroup title="Button text" isRequired withLabel>
          <Input
            placeholder="Button display text"
            register={register}
            name="name"
            required
          />
        </InputGroup>
        <InputGroup title="Button URL" isRequired withLabel>
          <Input
            placeholder="Button URL"
            register={register}
            name="name"
            required
          />
        </InputGroup>

        <Checkbox label="Force funnel" register={register} name="forceFunnel" />
        <div className="flex justify-end">
          <HeaderButton
            containerClassname="mr-3"
            name="Cancel"
            variant="secondary"
          />
          <HeaderButton name="Save" />
        </div>
      </AdminSidebar>

      <AdminShowcase>
        <div className="px-12 sm:px-12">
          {
            // @debt use a single structure of type
            // Record<VenueTemplate,TemplateInfo> to compile all these .includes()
            // arrays
            // BACKGROUND_IMG_TEMPLATES.includes(
            //   space.template as VenueTemplate
            // ) && (
            // <MapPreview
            //   isEditing={false}
            //   worldId={space.worldId}
            //   venueId={space.id}
            //   venueName={space.name}
            //   mapBackground={space.mapBackgroundImageUrl}
            //   rooms={space.rooms ?? ALWAYS_EMPTY_ARRAY}
            //   safeZone={space.config?.safeZone || DEFAULT_SAFE_ZONE}
            // />
            // )
          }
        </div>
      </AdminShowcase>
    </ThreeColumnLayout>
  );
};
