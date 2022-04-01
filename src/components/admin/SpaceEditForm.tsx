import React, { useCallback, useEffect, useMemo } from "react";
import { useForm, useFormState } from "react-hook-form";
import { useAsyncFn } from "react-use";
import { yupResolver } from "@hookform/resolvers/yup";
import { BackgroundSelect } from "components/admin/BackgroundSelect";
import { Checkbox } from "components/admin/Checkbox";
import { ImageInput } from "components/admin/ImageInput";
import { Input } from "components/admin/Input";
import { InputGroup } from "components/admin/InputGroup";
import { PortalVisibility } from "components/admin/PortalVisibility";
import { SidebarHeader } from "components/admin/SidebarHeader";
import { SpacesDropdown } from "components/admin/SpacesDropdown";
import { Textarea } from "components/admin/Textarea";
import { Toggle } from "components/admin/Toggle";

import {
  ADMIN_IA_SPACE_BASE_PARAM_URL,
  BACKGROUND_IMG_TEMPLATES,
  COMMON_NAME_MAX_CHAR_COUNT,
  DEFAULT_EMBED_URL,
  DEFAULT_REACTIONS_MUTED,
  DEFAULT_SECTIONS_AMOUNT,
  DEFAULT_SHOW_CONTENT,
  DEFAULT_SHOW_REACTIONS,
  DEFAULT_SHOW_SHOUTOUTS,
  DEFAULT_VENUE_AUTOPLAY,
  DEFAULT_VENUE_LOGO,
  DISABLED_DUE_TO_1253,
  EMBEDDABLE_CONTENT_TEMPLATES,
  HAS_GRID_TEMPLATES,
  HAS_REACTIONS_TEMPLATES,
  IFRAME_TEMPLATES,
  MAX_SECTIONS_AMOUNT,
  MIN_SECTIONS_AMOUNT,
  PORTAL_INFO_ICON_MAPPING,
  SECTION_DEFAULT_COLUMNS_COUNT,
  SECTION_DEFAULT_ROWS_COUNT,
  SUBVENUE_TEMPLATES,
  ZOOM_URL_TEMPLATES,
} from "settings";

import { createSlug } from "api/admin";
import { updateVenueNG } from "api/venue";
import { World } from "api/world";

import { AnyVenue } from "types/venues";
import { VenueTemplate } from "types/VenueTemplate";

import { convertToEmbeddableUrl } from "utils/embeddableUrl";
import { WithId } from "utils/id";
import { generateUrl } from "utils/url";

import { spaceEditSchema } from "forms/spaceEditSchema";

import { useFetchAssets } from "hooks/useFetchAssets";
import { useUserId } from "hooks/user/useUserId";
import { useRelatedVenues } from "hooks/useRelatedVenues";

import { AdminSidebarButtons } from "components/organisms/AdminVenueView/components/AdminSidebarButtons";

import { FormErrors } from "components/molecules/FormErrors";
import { SubmitError } from "components/molecules/SubmitError";
import { YourUrlDisplay } from "components/molecules/YourUrlDisplay";

import { Button } from "./Button";

const HANDLED_ERRORS = [
  "name",
  "subtitle",
  "mapBackgroundImage",
  "iframeUrl",
  "zoomUrl",
  "auditoriumColumns",
  "auditoriumRows",
  "columns",
];

export interface SpaceEditFormProps {
  space: WithId<AnyVenue>;
  world: World;
}

export const SpaceEditForm: React.FC<SpaceEditFormProps> = ({
  space,
  world,
}) => {
  const spaceLogoImage =
    PORTAL_INFO_ICON_MAPPING[space.template] ?? DEFAULT_VENUE_LOGO;

  const { userId } = useUserId();

  const defaultValues = useMemo(
    () => ({
      name: space.name ?? "",
      subtitle: space.config?.landingPageConfig?.subtitle,
      description: space.config?.landingPageConfig?.description ?? "",
      mapBackgroundImage: space.mapBackgroundImageUrl ?? "",
      iframeUrl: space.iframeUrl ?? DEFAULT_EMBED_URL,
      showGrid: space.showGrid ?? false,
      showReactions: space.showReactions ?? DEFAULT_SHOW_REACTIONS,
      showShoutouts: space.showShoutouts ?? DEFAULT_SHOW_SHOUTOUTS,
      auditoriumColumns:
        space.auditoriumColumns ?? SECTION_DEFAULT_COLUMNS_COUNT,
      auditoriumRows: space.auditoriumRows ?? SECTION_DEFAULT_ROWS_COUNT,
      columns: space.columns ?? 0,
      autoPlay: space.autoPlay ?? DEFAULT_VENUE_AUTOPLAY,
      isReactionsMuted: space.isReactionsMuted ?? DEFAULT_REACTIONS_MUTED,
      // @debt should use SpaceId type here, resolve error with form typing
      parentId: (space.parentId as string) ?? "",
      numberOfSections: space.sectionsCount ?? DEFAULT_SECTIONS_AMOUNT,
      roomVisibility: space.roomVisibility,
      zoomUrl: space?.zoomUrl ?? "",
      logoImage: undefined,
      logoImageUrl: space?.host?.icon ?? spaceLogoImage,
      showContent: space.showContent ?? DEFAULT_SHOW_CONTENT,
      backgroundImage: undefined,
      backgroundImageUrl: space.backgroundImageUrl,
    }),
    [
      space.name,
      space.config?.landingPageConfig?.subtitle,
      space.config?.landingPageConfig?.description,
      space.mapBackgroundImageUrl,
      space.iframeUrl,
      space.showGrid,
      space.showReactions,
      space.showShoutouts,
      space.auditoriumColumns,
      space.auditoriumRows,
      space.columns,
      space.autoPlay,
      space.isReactionsMuted,
      space.parentId,
      space.sectionsCount,
      space.roomVisibility,
      space?.zoomUrl,
      space?.host?.icon,
      space.showContent,
      space.backgroundImageUrl,
      spaceLogoImage,
    ]
  );

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
    resolver: yupResolver(spaceEditSchema),
    defaultValues,
  });

  const { errors } = useFormState({ control });

  const {
    assets: mapBackgrounds,
    isLoading: isLoadingBackgrounds,
    error: errorFetchBackgrounds,
  } = useFetchAssets("mapBackgrounds");

  useEffect(() => reset(defaultValues), [defaultValues, reset]);

  const values = watch();

  const [{ loading: isUpdating, error: updateError }, updateVenue] = useAsyncFn(
    async (data) => {
      if (!userId || !space.id) return;

      const embedUrl = convertToEmbeddableUrl({
        url: data.iframeUrl,
        autoPlay: space.autoPlay,
      });

      await updateVenueNG(
        {
          id: space.id,
          worldId: space.worldId,
          ...data,
          template: space.template,
          description: {
            text: data.description,
          },
          iframeUrl: embedUrl || DEFAULT_EMBED_URL,
        },
        userId
      );
    },
    [userId, space.id, space.autoPlay, space.worldId, space.template]
  );

  const isReactionsMutedDisabled = !values?.showReactions;

  const { relatedVenues } = useRelatedVenues();

  const backButtonOptionList = useMemo(
    () =>
      Object.fromEntries(
        relatedVenues
          .filter(
            ({ id, worldId }) => !(space.worldId !== worldId || id === space.id)
          )
          .map((venue) => [venue.id, venue])
      ),
    [relatedVenues, space.worldId, space.id]
  );

  const parentSpace = useMemo(
    () =>
      space.parentId
        ? relatedVenues.find(({ id }) => id === space.parentId)
        : { name: "" },
    [relatedVenues, space.parentId]
  );

  const { name: watchedName } = watch();
  const slug = useMemo(() => createSlug(watchedName), [watchedName]);

  const changePortalImageUrl = useCallback(
    ({ url }) => {
      setValue("logoImageUrl", url, { shouldValidate: false });
    },
    [setValue]
  );

  const changeBackgroundImageUrl = useCallback(
    ({ url }) => {
      setValue("backgroundImageUrl", url, { shouldValidate: false });
    },
    [setValue]
  );

  // TODO-redesign
  // Probably want to use ${SPACE_INFO_MAP[space.template].icon} for the logo

  const numberOfSectionsSubtext = `${
    values.numberOfSections || 0
  } Sections * 200 Seats = ${200 * values.numberOfSections} (Capacity)`;

  return (
    <div className="SpaceEditForm">
      <form onSubmit={handleSubmit(updateVenue)}>
        <div className="SpaceEditForm__portal">
          <SidebarHeader>The basics</SidebarHeader>
          <InputGroup
            title="Space name"
            subtitle="max 50 characters"
            isRequired
            withLabel
          >
            <Input
              placeholder="Space Name"
              register={register}
              name="name"
              errors={errors}
              max={COMMON_NAME_MAX_CHAR_COUNT}
              required
            />
          </InputGroup>
          <InputGroup title="Your URL will be">
            <YourUrlDisplay
              path={generateUrl({
                route: ADMIN_IA_SPACE_BASE_PARAM_URL,
                required: ["worldSlug"],
                params: { worldSlug: world.slug },
              })}
              slug={slug}
            />
          </InputGroup>
          <InputGroup title="Subtitle">
            <Input
              placeholder="Subtitle for your space"
              register={register}
              name="subtitle"
              errors={errors}
            />
          </InputGroup>
          <InputGroup title="Description">
            <Textarea
              placeholder={`Let your guests know what they’ll find when they join your space. Keep it short & sweet, around 2-3 sentences maximum. Be sure to indicate any expectations for their participation.`}
              register={register}
              name="description"
              errors={errors}
            />
          </InputGroup>
          <InputGroup title="Select the space for the “back” button">
            <SpacesDropdown
              spaces={backButtonOptionList}
              setValue={setValue}
              register={register}
              fieldName="parentId"
              parentSpace={parentSpace}
              error={errors?.parentId}
            />
          </InputGroup>
          {SUBVENUE_TEMPLATES.includes(space.template as VenueTemplate) && (
            <InputGroup title="Default portal appearance">
              <PortalVisibility
                getValues={getValues}
                name="roomVisibility"
                register={register}
                setValue={setValue}
              />
            </InputGroup>
          )}

          <SidebarHeader>Appearance</SidebarHeader>
          <InputGroup
            title="Upload a background image"
            subtitle="A plain 1920 x 1080px image works best."
            withLabel
          >
            <ImageInput
              onChange={changeBackgroundImageUrl}
              name="backgroundImage"
              imgUrl={values.backgroundImageUrl}
              error={errors.backgroundImageUrl}
              register={register}
              setValue={setValue}
            />
          </InputGroup>
          <InputGroup
            title="Upload a logo"
            withLabel
            subtitle="(A transparent 300 px square image works best)"
          >
            <ImageInput
              onChange={changePortalImageUrl}
              name="logoImage"
              imgUrl={values.logoImageUrl}
              error={errors.logoImageUrl}
              setValue={setValue}
              register={register}
            />
          </InputGroup>

          {BACKGROUND_IMG_TEMPLATES.includes(
            space.template as VenueTemplate
          ) && (
            <>
              <div className="mb-10"></div>

              <SidebarHeader>Map background</SidebarHeader>
              <BackgroundSelect
                isLoadingBackgrounds={isLoadingBackgrounds}
                mapBackgrounds={mapBackgrounds}
                venueName={space.name}
                spaceSlug={space.slug}
                worldId={space.worldId}
                venueId={space.id}
                register={register}
                imageUrl={space.mapBackgroundImageUrl}
              />
              {errorFetchBackgrounds && (
                <>
                  <div>
                    The preset map backgrounds could not be fetched. Please,
                    refresh the page or upload a custom map background.
                  </div>
                  <div>Error: {errorFetchBackgrounds.message}</div>
                </>
              )}
            </>
          )}

          {EMBEDDABLE_CONTENT_TEMPLATES.includes(
            space.template as VenueTemplate
          ) && <SidebarHeader>Embedable content</SidebarHeader>}

          {space.template &&
            // @debt use a single structure of type Record<VenueTemplate,TemplateInfo> to compile all these .includes() arrays' flags
            IFRAME_TEMPLATES.includes(space.template as VenueTemplate) && (
              <>
                <Toggle
                  label="Show content"
                  register={register}
                  name="showContent"
                  checked={values.showContent}
                />
                {values.showContent && (
                  <InputGroup title="Livestream URL" margin="no-bottom">
                    <Input
                      placeholder="Livestream or embed URL"
                      register={register}
                      name="iframeUrl"
                      errors={errors}
                      disabled={!values.showContent}
                    />
                    <Checkbox
                      label="Autoplay"
                      register={register}
                      name="autoPlay"
                      disabled={!values.showContent}
                    />
                  </InputGroup>
                )}
              </>
            )}

          {space.template &&
            // @debt use a single structure of type Record<VenueTemplate,TemplateInfo> to compile all these .includes() arrays' flags
            ZOOM_URL_TEMPLATES.includes(space.template as VenueTemplate) && (
              <InputGroup title="URL" withLabel>
                <Input
                  type="text"
                  placeholder="URL"
                  register={register}
                  name="zoomUrl"
                  errors={errors}
                  autoComplete="off"
                />
              </InputGroup>
            )}

          {!DISABLED_DUE_TO_1253 &&
            // @debt use a single structure of type Record<VenueTemplate,TemplateInfo> to compile all these .includes() arrays' flags
            HAS_GRID_TEMPLATES.includes(space.template as VenueTemplate) && (
              <Checkbox
                label="Show grid layout"
                variant="toggler"
                register={register}
                name="showGrid"
              />
            )}

          {
            // @debt use a single structure of type Record<VenueTemplate,TemplateInfo> to compile all these .includes() arrays' flags
            HAS_REACTIONS_TEMPLATES.includes(
              space.template as VenueTemplate
            ) && (
              <>
                <Toggle
                  label="Show reactions"
                  register={register}
                  name="showReactions"
                  checked={values.showReactions}
                />
                {values.showReactions && (
                  <Checkbox
                    register={register}
                    label="Audible"
                    name="isReactionsMuted"
                    disabled={isReactionsMutedDisabled}
                  />
                )}
                <Toggle
                  label="Show shoutouts"
                  register={register}
                  name="showShoutouts"
                  checked={values.showShoutouts}
                />
              </>
            )
          }

          {!DISABLED_DUE_TO_1253 &&
            HAS_GRID_TEMPLATES.includes(space.template as VenueTemplate) &&
            values.showGrid && (
              <>
                <div className="input-container">
                  <h4 className="italic input-header">Number of columns</h4>
                  <input
                    defaultValue={1}
                    type="number"
                    {...register("columns")}
                    className="align-left"
                    placeholder={`Number of grid columns`}
                  />
                  {errors?.columns ? (
                    <span className="input-error">
                      {errors?.columns.message}
                    </span>
                  ) : null}
                </div>
                <div className="input-container">
                  <h4 className="italic input-header">Number of rows</h4>
                  <div>
                    Not editable. The number of rows is derived from the number
                    of specified columns and the width:height ratio of the party
                    map, to keep the two aligned.
                  </div>
                </div>
              </>
            )}

          <div className="mb-10"></div>

          {space.template === VenueTemplate.auditorium && (
            <>
              <SidebarHeader>Extras</SidebarHeader>
              <InputGroup title=" Number of seats columns">
                <Input
                  defaultValue={SECTION_DEFAULT_COLUMNS_COUNT}
                  min={5}
                  type="number"
                  name="auditoriumColumns"
                  register={register}
                  className="align-left"
                  placeholder="Number of seats columns"
                  errors={errors}
                />
              </InputGroup>

              <InputGroup title="Number of seats rows">
                <Input
                  name="auditoriumRows"
                  type="number"
                  className="align-left"
                  placeholder="Number of seats rows"
                  min={5}
                  register={register}
                />
              </InputGroup>

              <InputGroup title="Number of sections" isOptional>
                <Input
                  register={register}
                  name="numberOfSections"
                  type="number"
                  min={MIN_SECTIONS_AMOUNT}
                  max={MAX_SECTIONS_AMOUNT}
                  error={errors.numberOfSections}
                  subtext={numberOfSectionsSubtext}
                />
              </InputGroup>
            </>
          )}
          <FormErrors errors={errors} omitted={HANDLED_ERRORS} />
          <SubmitError error={updateError} />
        </div>

        <AdminSidebarButtons>
          <Button
            type="submit"
            variant="primary"
            loading={isUpdating}
            disabled={isUpdating}
          >
            Save changes
          </Button>
        </AdminSidebarButtons>
      </form>
    </div>
  );
};
