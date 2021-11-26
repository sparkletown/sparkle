import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ErrorMessage, useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import Bugsnag from "@bugsnag/js";
import * as Yup from "yup";

import {
  ADMIN_V1_ROOT_URL,
  ALL_VENUE_TEMPLATES,
  HAS_ROOMS_TEMPLATES,
  PLAYA_ICON_SIDE_PERCENTAGE,
  PLAYA_IMAGE,
  PLAYA_VENUE_STYLES,
  ROOM_TAXON,
} from "settings";

import { upsertRoom } from "api/admin";

import { Room, RoomInput } from "types/rooms";
import { ExtractProps } from "types/utility";
import { PartyMapVenue } from "types/venues";

import { venueInsideUrl } from "utils/url";

import { useSpaceBySlug } from "hooks/spaces/useSpaceBySlug";
import { useSpaceParams } from "hooks/spaces/useSpaceParams";
import { useQuery } from "hooks/useQuery";
import { useUser } from "hooks/useUser";

import Login from "pages/Account/Login";
import { PartyMapContainer } from "pages/Account/Venue/VenueMapEdition";
import { SubVenueIconMap } from "pages/Account/Venue/VenueMapEdition/Container";

import WithNavigationBar from "components/organisms/WithNavigationBar";

import { ImageInput } from "components/molecules/ImageInput";
import { LoadingPage } from "components/molecules/LoadingPage";

import { AdminRestricted } from "components/atoms/AdminRestricted";
import { NotFound } from "components/atoms/NotFound";
import { PortalVisibility } from "components/atoms/PortalVisibility";
import { Toggler } from "components/atoms/Toggler";

import RoomDeleteModal from "./RoomDeleteModal";
import { validationSchema } from "./RoomsValidationSchema";

import "../Venue.scss";

export const RoomsForm: React.FC = () => {
  const { spaceSlug } = useSpaceParams();
  const { space, spaceId, isLoaded: isSpaceLoaded } = useSpaceBySlug(spaceSlug);
  const history = useHistory();
  const { user } = useUser();
  const queryParams = useQuery();
  const queryRoomIndexString = queryParams.get("roomIndex");
  const queryRoomIndex = queryRoomIndexString
    ? parseInt(queryRoomIndexString)
    : undefined;

  const room = useMemo(() => {
    if (
      typeof queryRoomIndex === "undefined" ||
      !space ||
      !space.rooms ||
      space.rooms.length - 1 < queryRoomIndex
    )
      return undefined;

    return space.rooms[queryRoomIndex];
  }, [queryRoomIndex, space]);

  if (!isSpaceLoaded) return <LoadingPage />;

  if (!space || !spaceId || !spaceSlug) return <NotFound />;

  const template = ALL_VENUE_TEMPLATES.find(
    (template) => space.template === template.template
  );

  if (!template || !HAS_ROOMS_TEMPLATES.includes(template.template)) {
    history.replace("/admin");
  }

  if (!user) {
    return <Login formType="login" venueId={spaceId} />;
  }

  return (
    <WithNavigationBar>
      <AdminRestricted>
        <RoomInnerForm
          spaceSlug={spaceSlug}
          spaceId={spaceId}
          venue={space as PartyMapVenue}
          editingRoom={room}
          editingRoomIndex={queryRoomIndex}
        />
      </AdminRestricted>
    </WithNavigationBar>
  );
};

interface RoomInnerFormProps {
  spaceId: string;
  spaceSlug: string;
  venue: PartyMapVenue;
  editingRoom?: Room;
  editingRoomIndex?: number;
}

export type FormValues = Yup.InferType<typeof validationSchema>;

const RoomInnerForm: React.FC<RoomInnerFormProps> = (props) => {
  const { venue, spaceId, spaceSlug, editingRoom, editingRoomIndex } = props;

  const defaultValues = useMemo(() => validationSchema.cast(editingRoom), [
    editingRoom,
  ]);

  const {
    watch,
    register,
    handleSubmit,
    errors,
    formState: { isSubmitting },
    setValue,
    getValues,
  } = useForm<FormValues>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    validationSchema: validationSchema,
    validationContext: { editing: !!editingRoom },
    defaultValues: {
      ...defaultValues,
      url: defaultValues.url ?? venueInsideUrl(spaceSlug),
      visibility: editingRoom?.visibility ?? venue.roomVisibility,
    },
  });

  const { user } = useUser();
  const history = useHistory();

  const values = watch();
  const disable = isSubmitting;

  const [formError, setFormError] = useState(false);

  const onSubmit = useCallback(
    async (input: FormValues) => {
      if (!user) return;

      try {
        const roomValues: RoomInput = {
          ...editingRoom,
          ...input,
        };
        await upsertRoom(roomValues, spaceId, user, editingRoomIndex);
        history.push(`${ADMIN_V1_ROOT_URL}/${spaceSlug}`);
      } catch (e) {
        setFormError(true);
        Bugsnag.notify(e, (event) => {
          event.addMetadata("Admin::RoomsForm::onSubmit", {
            spaceId,
            vals: input,
            editingRoomIndex,
          });
        });
      }
    },
    [user, editingRoom, spaceId, editingRoomIndex, history, spaceSlug]
  );

  useEffect(() => {
    register("x_percent");
    register("y_percent");
    register("width_percent");
    register("height_percent");
  }, [register]);

  const iconPositionFieldName = "iconPosition";
  const onBoxChange: ExtractProps<
    typeof PartyMapContainer
  >["onChange"] = useCallback(
    (val) => {
      if (!(iconPositionFieldName in val)) return;
      const iconPos = val[iconPositionFieldName];
      setValue("x_percent", iconPos.left);
      setValue("y_percent", iconPos.top);
      setValue("width_percent", iconPos.width);
      setValue("height_percent", iconPos.height);
    },
    [setValue]
  );

  const imageUrl = useMemo(
    () =>
      values.image_file && values.image_file.length > 0
        ? URL.createObjectURL(values.image_file[0])
        : values.image_url,
    [values.image_file, values.image_url]
  );

  const currentRoomIcon = useMemo(
    (): SubVenueIconMap =>
      imageUrl
        ? {
            [iconPositionFieldName]: {
              width: values.width_percent || PLAYA_ICON_SIDE_PERCENTAGE,
              height: values.height_percent || PLAYA_ICON_SIDE_PERCENTAGE,
              left: values.x_percent || 0,
              top: values.y_percent || 0,
              url: imageUrl,
              title: values.title,
            },
          }
        : {},
    [
      imageUrl,
      values.x_percent,
      values.y_percent,
      values.width_percent,
      values.height_percent,
      values.title,
    ]
  );

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <>
      <div className="page">
        <div className="page-side">
          <div className="page-container-left">
            <div className="page-container-left-content">
              <form
                className="full-height-container"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="scrollable-content">
                  <h4 className="italic">
                    {`${editingRoom ? "Edit your" : "Add a"} ${
                      ROOM_TAXON.lower
                    }`}
                  </h4>
                  <p className="small light" style={{ marginBottom: "2rem" }}>
                    You can update everything in this form at a later date on
                    the edit page
                  </p>
                  <div className="input-container">
                    <div className="input-title">
                      Name your {ROOM_TAXON.lower}
                    </div>
                    <input
                      disabled={disable}
                      name="title"
                      ref={register}
                      className="align-left"
                      placeholder={`My ${ROOM_TAXON.lower} title`}
                    />
                    {errors.title && (
                      <span className="input-error">
                        {errors.title.message}
                      </span>
                    )}
                  </div>

                  <div className="input-container">
                    <div className="input-title">
                      Upload an image for how your {ROOM_TAXON.lower} should
                      appear on the Space map
                    </div>
                    <ImageInput
                      disabled={disable}
                      name={"image_file"}
                      image={values.image_file}
                      remoteUrlInputName={"image_url"}
                      remoteImageUrl={values.image_url}
                      containerClassName="input-square-container"
                      register={register}
                      setValue={setValue}
                      error={errors.image_file || errors.image_url}
                    />
                  </div>
                  <div className="input-container">
                    <div className="input-title">
                      Give your {ROOM_TAXON.lower} a subtitle
                    </div>
                    <input
                      name="subtitle"
                      disabled={disable}
                      ref={register}
                      className="align-left"
                      placeholder={`My ${ROOM_TAXON.lower} subtitle`}
                    />
                    {errors.subtitle && (
                      <span className="input-error">
                        {errors.subtitle.message}
                      </span>
                    )}
                  </div>
                  <div className="input-container">
                    <div className="input-title">
                      About your {ROOM_TAXON.lower}
                    </div>
                    <textarea
                      disabled={disable}
                      name={"about"}
                      ref={register}
                      className="wide-input-block input-centered align-left"
                      placeholder={`Describe your ${ROOM_TAXON.lower} in detail`}
                    />
                    {errors.about && (
                      <span className="input-error">
                        {errors.about.message}
                      </span>
                    )}
                  </div>
                  <div className="input-container">
                    <div className="input-title">
                      The {ROOM_TAXON.lower} url
                    </div>
                    <input
                      disabled={disable}
                      name={"url"}
                      ref={register}
                      className="wide-input-block align-left"
                      placeholder={`The url this ${ROOM_TAXON.lower} will redirect to`}
                    />
                    {errors.url && (
                      <span className="input-error">{errors.url.message}</span>
                    )}
                  </div>
                  <div className="toggle-room">
                    {/* @debt pass the header into Toggler's 'label' prop instead of being external like this*/}
                    <div className="input-title">Enabled ?</div>
                    <Toggler
                      name="isEnabled"
                      forwardedRef={register}
                      disabled={disable}
                    />
                  </div>
                  <div className="toggle-room">
                    <PortalVisibility
                      getValues={getValues}
                      label="Change label appearance (overrides global settings)"
                      name="visibility"
                      register={register}
                      setValue={setValue}
                    />
                  </div>
                </div>
                <div className="page-container-left-bottombar">
                  <div />
                  <div>
                    <SubmitButton
                      editing={!!editingRoom}
                      isSubmitting={isSubmitting}
                    />
                    {editingRoom && !isSubmitting && (
                      <button
                        type={"button"}
                        className="btn btn-danger"
                        onClick={() => setShowDeleteModal(true)}
                      >
                        Delete {ROOM_TAXON.lower}
                      </button>
                    )}
                  </div>
                  {formError && (
                    <div className="input-error">
                      <div>
                        One or more errors occurred when saving the form:
                      </div>
                      {Object.keys(errors).map((fieldName) => (
                        <div key={fieldName}>
                          <span>Error in {fieldName}:</span>
                          <ErrorMessage
                            errors={errors}
                            name={fieldName}
                            as="span"
                            key={fieldName}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="page-side preview">
          <h4
            className="italic"
            style={{ textAlign: "center", fontSize: "22px" }}
          >
            Position your {ROOM_TAXON.lower} in the Space
          </h4>
          <p>
            First upload or select the icon you would like to appear in your
            camp, then drag it around to position it
          </p>
          <div className="playa">
            {venue.mapBackgroundImageUrl && (
              <PartyMapContainer
                interactive
                resizable
                coordinatesBoundary={{
                  width: 100,
                  height: 100,
                }}
                onChange={onBoxChange}
                snapToGrid={false}
                iconsMap={currentRoomIcon}
                backgroundImage={venue.mapBackgroundImageUrl || PLAYA_IMAGE}
                iconImageStyle={PLAYA_VENUE_STYLES.iconImage}
                draggableIconImageStyle={PLAYA_VENUE_STYLES.draggableIconImage}
                venue={venue}
                currentRoomIndex={editingRoomIndex}
                otherIconsStyle={{ opacity: 0.4 }}
              />
            )}
          </div>
        </div>
      </div>
      {!!editingRoom && (
        <RoomDeleteModal
          show={showDeleteModal}
          onHide={() => {
            setShowDeleteModal(false);
          }}
          venueId={spaceId}
          room={editingRoom}
        />
      )}
    </>
  );
};

interface SubmitButtonProps {
  isSubmitting: boolean;
  editing?: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  isSubmitting,
  editing,
}) => {
  return isSubmitting ? (
    <div className="spinner-border">
      <span className="sr-only">Loading...</span>
    </div>
  ) : (
    <button className="btn btn-primary" type="submit">
      {editing ? `Update ${ROOM_TAXON.lower}` : `Create ${ROOM_TAXON.lower}`}
    </button>
  );
};
