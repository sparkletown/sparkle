import React, { useCallback, useEffect, useMemo } from "react";
import { useForm, useFormState } from "react-hook-form";
import { useAsyncFn, useCss } from "react-use";
import { yupResolver } from "@hookform/resolvers/yup";
import classNames from "classnames";

import {
  ADMIN_IA_SPACE_BASE_PARAM_URL,
  ALWAYS_NOOP_FUNCTION,
  BACKGROUND_IMG_TEMPLATES,
  DEFAULT_EMBED_URL,
  DEFAULT_REACTIONS_MUTED,
  DEFAULT_SECTIONS_AMOUNT,
  DEFAULT_SHOW_REACTIONS,
  DEFAULT_SHOW_SHOUTOUTS,
  DEFAULT_VENUE_AUTOPLAY,
  DEFAULT_VENUE_LOGO,
  DISABLED_DUE_TO_1253,
  HAS_GRID_TEMPLATES,
  HAS_REACTIONS_TEMPLATES,
  IFRAME_TEMPLATES,
  MAX_SECTIONS_AMOUNT,
  MIN_SECTIONS_AMOUNT,
  PORTAL_INFO_ICON_MAPPING,
  SECTION_DEFAULT_COLUMNS_COUNT,
  SECTION_DEFAULT_ROWS_COUNT,
  SPACE_INFO_MAP,
  STRING_EMPTY,
  SUBVENUE_TEMPLATES,
  ZOOM_URL_TEMPLATES,
} from "settings";

import { createSlug } from "api/admin";
import { updateVenueNG } from "api/venue";

import { UserId, WorldSlug } from "types/id";
import { AnyVenue } from "types/venues";
import { VenueTemplate } from "types/VenueTemplate";

import { convertToEmbeddableUrl } from "utils/embeddableUrl";
import { WithId } from "utils/id";
import { generateUrl } from "utils/url";

import { spaceEditSchema } from "forms/spaceEditSchema";

import { useFetchAssets } from "hooks/useFetchAssets";
import { useRelatedVenues } from "hooks/useRelatedVenues";

import { BackgroundSelect } from "pages/Admin/BackgroundSelect";

import { AdminSidebarButtons } from "components/organisms/AdminVenueView/components/AdminSidebarButtons";
import { AdminSidebarSectionTitle } from "components/organisms/AdminVenueView/components/AdminSidebarSectionTitle";

import { AdminCheckbox } from "components/molecules/AdminCheckbox";
import { AdminInput } from "components/molecules/AdminInput";
import { AdminSection } from "components/molecules/AdminSection";
import { AdminSidebarAccordion } from "components/molecules/AdminSectionAccordion";
import { AdminTextarea } from "components/molecules/AdminTextarea";
import { FormErrors } from "components/molecules/FormErrors";
import { SubmitError } from "components/molecules/SubmitError";
import { YourUrlDisplay } from "components/molecules/YourUrlDisplay";

import { ButtonNG } from "components/atoms/ButtonNG";
import { ImageInput } from "components/atoms/ImageInput";
import { InputField } from "components/atoms/InputField";
import { PortalVisibility } from "components/atoms/PortalVisibility";
import { SpacesDropdown } from "components/atoms/SpacesDropdown";

import "./SpaceEditForm.scss";

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
  userId: UserId;
  worldSlug: WorldSlug;
}

export const SpaceEditForm: React.FC<SpaceEditFormProps> = ({
  space,
  userId,
  worldSlug,
}) => {
  const spaceLogoImage =
    PORTAL_INFO_ICON_MAPPING[space.template] ?? DEFAULT_VENUE_LOGO;

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
      parentId: space.parentId ?? "",
      numberOfSections: space.sectionsCount ?? DEFAULT_SECTIONS_AMOUNT,
      roomVisibility: space.roomVisibility,
      zoomUrl: space?.zoomUrl ?? "",
      bannerImage: undefined,
      bannerImageUrl: space?.config?.landingPageConfig?.coverImageUrl ?? "",
      logoImage: undefined,
      logoImageUrl: space?.host?.icon ?? spaceLogoImage,
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
      space.zoomUrl,
      space?.host?.icon,
      space?.config?.landingPageConfig?.coverImageUrl,
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
    (val: string) => {
      setValue("logoImageUrl", val, { shouldValidate: false });
    },
    [setValue]
  );

  const changeBackgroundImageUrl = useCallback(
    (val: string) => {
      setValue("bannerImageUrl", val, { shouldValidate: false });
    },
    [setValue]
  );

  const logoStyle = useCss({
    "background-image": `url(${SPACE_INFO_MAP[space.template].icon})`,
  });
  const logoClasses = classNames("SpaceEditForm__logo", logoStyle);

  return (
    <div className="SpaceEditForm">
      <form onSubmit={handleSubmit(updateVenue)}>
        <div className="SpaceEditForm__portal">
          <AdminSidebarSectionTitle>
            Edit general settings
          </AdminSidebarSectionTitle>
          <AdminSidebarAccordion title="The basics" open>
            <AdminSection title="Space template" withLabel>
              <div className="SpaceEditForm__template">
                <div className={logoClasses} />
                <AdminInput
                  value={SPACE_INFO_MAP[space.template].text}
                  disabled
                  name={STRING_EMPTY}
                  register={ALWAYS_NOOP_FUNCTION}
                />
              </div>
            </AdminSection>
            <AdminSection title="Rename your space" withLabel>
              <AdminInput
                placeholder="Space Name"
                register={register}
                name="name"
                errors={errors}
                required
              />
            </AdminSection>
            <AdminSection title="Your URL will be">
              <YourUrlDisplay
                path={generateUrl({
                  route: ADMIN_IA_SPACE_BASE_PARAM_URL,
                  required: ["worldSlug"],
                  params: { worldSlug },
                })}
                slug={slug}
              />
            </AdminSection>
            <AdminSection title="Subtitle" withLabel>
              <AdminInput
                placeholder="Subtitle for your space"
                register={register}
                name="subtitle"
                errors={errors}
              />
            </AdminSection>
            <AdminSection title="Description" withLabel>
              <AdminTextarea
                placeholder={`Let your guests know what they’ll find when they join your space. Keep it short & sweet, around 2-3 sentences maximum. Be sure to indicate any expectations for their participation.`}
                register={register}
                name={"description"}
                errors={errors}
              />
            </AdminSection>
            <AdminSection
              title="Select the space for the “back” button"
              withLabel
            >
              <SpacesDropdown
                spaces={backButtonOptionList}
                setValue={setValue}
                register={register}
                fieldName="parentId"
                parentSpace={parentSpace}
                error={errors?.parentId}
              />
            </AdminSection>
            {SUBVENUE_TEMPLATES.includes(space.template as VenueTemplate) && (
              <AdminSection title="Default portal appearance">
                <PortalVisibility
                  getValues={getValues}
                  name="roomVisibility"
                  register={register}
                  setValue={setValue}
                />
              </AdminSection>
            )}
          </AdminSidebarAccordion>

          <AdminSidebarAccordion title="Appearance" open>
            <AdminSection
              title="Upload a highlight image"
              subtitle="A plain 1920 x 1080px image works best."
              withLabel
            >
              <ImageInput
                onChange={changeBackgroundImageUrl}
                name="bannerImage"
                imgUrl={values.bannerImageUrl}
                error={errors.bannerImageUrl}
                isInputHidden={!values.bannerImageUrl}
                register={register}
                setValue={setValue}
              />
            </AdminSection>
            <AdminSection
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
                small
              />
            </AdminSection>
          </AdminSidebarAccordion>

          {BACKGROUND_IMG_TEMPLATES.includes(
            space.template as VenueTemplate
          ) && (
            <AdminSidebarAccordion title="Map background">
              <BackgroundSelect
                isLoadingBackgrounds={isLoadingBackgrounds}
                mapBackgrounds={mapBackgrounds}
                venueName={space.name}
                spaceSlug={space.slug}
                worldId={space.worldId}
                venueId={space.id}
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
            </AdminSidebarAccordion>
          )}

          <AdminSidebarAccordion title="Embedable content" open>
            {space.template &&
              // @debt use a single structure of type Record<VenueTemplate,TemplateInfo> to compile all these .includes() arrays' flags
              IFRAME_TEMPLATES.includes(space.template as VenueTemplate) && (
                <AdminSection title="Livestream URL" withLabel>
                  <AdminInput
                    placeholder="Livestream URL"
                    register={register}
                    name="iframeUrl"
                    errors={errors}
                  />
                  <AdminCheckbox
                    label="Autoplay"
                    variant="toggler"
                    register={register}
                    name="autoPlay"
                  />
                </AdminSection>
              )}

            {space.template &&
              // @debt use a single structure of type Record<VenueTemplate,TemplateInfo> to compile all these .includes() arrays' flags
              ZOOM_URL_TEMPLATES.includes(space.template as VenueTemplate) && (
                <AdminSection title="URL" withLabel>
                  <AdminInput
                    type="text"
                    placeholder="URL"
                    register={register}
                    name="zoomUrl"
                    errors={errors}
                    autoComplete="off"
                  />
                </AdminSection>
              )}

            {!DISABLED_DUE_TO_1253 &&
              // @debt use a single structure of type Record<VenueTemplate,TemplateInfo> to compile all these .includes() arrays' flags
              HAS_GRID_TEMPLATES.includes(space.template as VenueTemplate) && (
                <AdminCheckbox
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
                <AdminSection>
                  <AdminCheckbox
                    label="Show shoutouts"
                    variant="toggler"
                    register={register}
                    name="showShoutouts"
                  />
                  <AdminCheckbox
                    label="Show reactions"
                    variant="toggler"
                    register={register}
                    name="showReactions"
                  />
                  <AdminCheckbox
                    variant="flip-switch"
                    register={register}
                    name={"isReactionsMuted"}
                    disabled={isReactionsMutedDisabled}
                    displayOn="Muted"
                    displayOff="Audible"
                  />
                </AdminSection>
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
                      Not editable. The number of rows is derived from the
                      number of specified columns and the width:height ratio of
                      the party map, to keep the two aligned.
                    </div>
                  </div>
                </>
              )}
          </AdminSidebarAccordion>

          {space.template === VenueTemplate.auditorium && (
            <AdminSidebarAccordion title="Extras" open>
              <AdminSection>
                <div className="input-container">
                  <h4 className="italic input-header">
                    Number of seats columns
                  </h4>
                  <input
                    defaultValue={SECTION_DEFAULT_COLUMNS_COUNT}
                    min={5}
                    type="number"
                    {...register("auditoriumColumns")}
                    className="align-left"
                    placeholder="Number of seats columns"
                  />
                  {errors?.auditoriumColumns ? (
                    <span className="input-error">
                      {errors?.auditoriumColumns.message}
                    </span>
                  ) : null}
                </div>
                <div className="input-container">
                  <h4 className="italic input-header">Number of seats rows</h4>
                  <input
                    defaultValue={SECTION_DEFAULT_ROWS_COUNT}
                    type="number"
                    {...register("auditoriumRows")}
                    className="align-left"
                    placeholder="Number of seats rows"
                    min={5}
                  />
                  {errors?.auditoriumRows ? (
                    <span className="input-error">
                      {errors?.auditoriumRows.message}
                    </span>
                  ) : null}
                </div>
              </AdminSection>

              <AdminSection title="Capacity (optional)">
                <div className="SpaceEditForm__capacity">
                  <div># Sections</div>
                  <div># Seats</div>
                  <div>Max seats</div>

                  <InputField
                    register={register}
                    name="numberOfSections"
                    type="number"
                    min={MIN_SECTIONS_AMOUNT}
                    max={MAX_SECTIONS_AMOUNT}
                    error={errors.numberOfSections}
                  />

                  <div>x 200</div>
                  <div>= {200 * values.numberOfSections}</div>
                </div>
              </AdminSection>
            </AdminSidebarAccordion>
          )}
          <FormErrors errors={errors} omitted={HANDLED_ERRORS} />
          <SubmitError error={updateError} />
        </div>

        <AdminSidebarButtons>
          <ButtonNG
            className="AdminSidebarButtons__button--larger"
            type="submit"
            variant="primary"
            loading={isUpdating}
            disabled={isUpdating}
          >
            Save changes
          </ButtonNG>
        </AdminSidebarButtons>
      </form>
    </div>
  );
};
