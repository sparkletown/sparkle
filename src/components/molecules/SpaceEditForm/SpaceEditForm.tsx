import React, { useCallback, useEffect, useMemo } from "react";
import { Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useAsyncFn } from "react-use";

import {
  BACKGROUND_IMG_TEMPLATES,
  DEFAULT_EMBED_URL,
  DEFAULT_REACTIONS_AUDIBLE,
  DEFAULT_SECTIONS_AMOUNT,
  DEFAULT_SHOW_REACTIONS,
  DEFAULT_SHOW_SHOUTOUTS,
  DEFAULT_VENUE_AUTOPLAY,
  DISABLED_DUE_TO_1253,
  HAS_GRID_TEMPLATES,
  HAS_REACTIONS_TEMPLATES,
  IFRAME_TEMPLATES,
  MAX_SECTIONS_AMOUNT,
  MIN_SECTIONS_AMOUNT,
  ROOM_TAXON,
  SECTION_DEFAULT_COLUMNS_COUNT,
  SECTION_DEFAULT_ROWS_COUNT,
  SUBVENUE_TEMPLATES,
} from "settings";

import { updateVenueNG } from "api/venue";

import { AnyVenue, VenueTemplate } from "types/venues";

import { convertToEmbeddableUrl } from "utils/embeddableUrl";
import { WithId } from "utils/id";

import { spaceEditSchema } from "forms/spaceEditSchema";

import { useOwnedVenues } from "hooks/useConnectOwnedVenues";
import { useUser } from "hooks/useUser";

import { AdminSidebarButtons } from "components/organisms/AdminVenueView/components/AdminSidebarButtons";
import { AdminSpacesListItem } from "components/organisms/AdminVenueView/components/AdminSpacesListItem";

import { AdminCheckbox } from "components/molecules/AdminCheckbox";
import { AdminInput } from "components/molecules/AdminInput";
import { AdminSection } from "components/molecules/AdminSection";
import { AdminTextarea } from "components/molecules/AdminTextarea";
import { FormErrors } from "components/molecules/FormErrors";
import { SubmitError } from "components/molecules/SubmitError";

import { ButtonNG } from "components/atoms/ButtonNG";
import ImageInput from "components/atoms/ImageInput";
import { InputField } from "components/atoms/InputField";
import { PortalVisibility } from "components/atoms/PortalVisibility";
import { SpacesDropdown } from "components/atoms/SpacesDropdown";

import "./SpaceEditForm.scss";

const HANDLED_ERRORS = [
  "name",
  "title",
  "subtitle",
  "image_url",
  "mapBackgroundImage",
  "iframeUrl",
  "zoomUrl",
  "auditoriumColumns",
  "auditoriumRows",
  "columns",
];

export interface SpaceEditFormProps {
  space: WithId<AnyVenue>;
}

export const SpaceEditForm: React.FC<SpaceEditFormProps> = ({ space }) => {
  const { user } = useUser();

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
      isReactionsMuted: space.isReactionsMuted ?? DEFAULT_REACTIONS_AUDIBLE,
      parentId: space.parentId ?? "",
      numberOfSections: space.sectionsCount ?? DEFAULT_SECTIONS_AMOUNT,
      roomVisibility: space.roomVisibility,
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
    ]
  );

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    watch,
    reset,
    errors,
  } = useForm({
    reValidateMode: "onChange",
    validationSchema: spaceEditSchema,
    defaultValues,
    validationContext: {
      template: space.template,
    },
  });

  useEffect(() => reset(defaultValues), [defaultValues, reset]);

  const values = watch();

  const changeBackgroundImageUrl = useCallback(
    (val: string) => {
      setValue("mapBackgroundImage", val, false);
    },
    [setValue]
  );

  const [{ loading: isUpdating, error: updateError }, updateVenue] = useAsyncFn(
    async (data) => {
      if (!user || !space.id) return;

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
        user
      );
    },
    [user, space.id, space.autoPlay, space.worldId, space.template]
  );

  const isReactionsMutedDisabled = !values?.showReactions;

  const { ownedVenues } = useOwnedVenues({});

  const backButtonOptionList = useMemo(
    () =>
      Object.fromEntries(
        ownedVenues
          .filter(
            ({ id, worldId }) => !(space.worldId !== worldId || id === space.id)
          )
          .map((venue) => [venue.id, venue])
      ),
    [ownedVenues, space.worldId, space.id]
  );

  const parentSpace = useMemo(
    () =>
      space.parentId
        ? ownedVenues.find(({ id }) => id === space.parentId)
        : { name: "" },
    [ownedVenues, space.parentId]
  );

  return (
    <Form onSubmit={handleSubmit(updateVenue)}>
      <div className="SpaceEditForm">
        <div className="SpaceEditForm__portal">
          <AdminSpacesListItem title="The basics" isOpened>
            <AdminSection title="Rename your space" withLabel>
              <AdminInput
                name="name"
                placeholder="Space Name"
                register={register}
                errors={errors}
                required
              />
            </AdminSection>
            <AdminSection title="Subtitle" withLabel>
              <AdminInput
                name="subtitle"
                placeholder="Subtitle for your space"
                register={register}
                errors={errors}
              />
            </AdminSection>
            <AdminSection title="Description" withLabel>
              <AdminTextarea
                name="description"
                placeholder={`Let your guests know what they’ll find when they join your space. Keep it short & sweet, around 2-3 sentences maximum. Be sure to indicate any expectations for their participation.`}
                register={register}
                errors={errors}
              />
            </AdminSection>
            <AdminSection
              title="Select the parent space for the “back” button"
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
          </AdminSpacesListItem>
          <AdminSpacesListItem title="Embedable content" isOpened>
            {space.template &&
              // @debt use a single structure of type Record<VenueTemplate,TemplateInfo> to compile all these .includes() arrays' flags
              IFRAME_TEMPLATES.includes(space.template as VenueTemplate) && (
                <AdminSection title="Livestream URL" withLabel>
                  <AdminInput
                    name="iframeUrl"
                    placeholder="Livestream URL"
                    register={register}
                    errors={errors}
                  />
                  <AdminCheckbox
                    name="autoPlay"
                    label="Autoplay"
                    variant="toggler"
                    register={register}
                  />
                </AdminSection>
              )}

            {
              // @debt use a single structure of type Record<VenueTemplate,TemplateInfo> to compile all these .includes() arrays' flags
              BACKGROUND_IMG_TEMPLATES.includes(
                space.template as VenueTemplate
              ) && (
                <>
                  <Form.Label>{ROOM_TAXON.capital} background</Form.Label>
                  {/* @debt: Create AdminImageInput to wrap ImageInput with error handling and labels */}
                  {/* ie. PortalVisibility/AdminInput */}
                  <ImageInput
                    onChange={changeBackgroundImageUrl}
                    name="mapBackgroundImage"
                    setValue={setValue}
                    register={register}
                    small
                    nameWithUnderscore
                    imgUrl={
                      space.mapBackgroundImageUrl ?? values.mapBackgroundImage
                    }
                    error={errors?.mapBackgroundImage}
                  />
                </>
              )
            }

            {!DISABLED_DUE_TO_1253 &&
              // @debt use a single structure of type Record<VenueTemplate,TemplateInfo> to compile all these .includes() arrays' flags
              HAS_GRID_TEMPLATES.includes(space.template as VenueTemplate) && (
                <AdminCheckbox
                  name="showGrid"
                  label="Show grid layout"
                  variant="toggler"
                  register={register}
                />
              )}

            {
              // @debt use a single structure of type Record<VenueTemplate,TemplateInfo> to compile all these .includes() arrays' flags
              HAS_REACTIONS_TEMPLATES.includes(
                space.template as VenueTemplate
              ) && (
                <AdminSection>
                  <AdminCheckbox
                    name="showShoutouts"
                    label="Show shoutouts"
                    variant="toggler"
                    register={register}
                  />
                  <AdminCheckbox
                    name="showReactions"
                    label="Show reactions"
                    variant="toggler"
                    register={register}
                  />
                  <AdminCheckbox
                    variant="flip-switch"
                    name="isReactionsMuted"
                    register={register}
                    disabled={isReactionsMutedDisabled}
                    displayOn="Audible"
                    displayOff="Muted"
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
                      name="columns"
                      type="number"
                      ref={register}
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
          </AdminSpacesListItem>

          {space.template === VenueTemplate.auditorium && (
            <AdminSpacesListItem title="Extras" isOpened>
              <AdminSection>
                <div className="input-container">
                  <h4 className="italic input-header">
                    Number of seats columns
                  </h4>
                  <input
                    defaultValue={SECTION_DEFAULT_COLUMNS_COUNT}
                    min={5}
                    name="auditoriumColumns"
                    type="number"
                    ref={register}
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
                    name="auditoriumRows"
                    type="number"
                    ref={register}
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
                    ref={register}
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
            </AdminSpacesListItem>
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
      </div>
    </Form>
  );
};
