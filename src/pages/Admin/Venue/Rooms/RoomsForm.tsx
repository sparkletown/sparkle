import React, {
  CSSProperties,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import WithNavigationBar from "components/organisms/WithNavigationBar";
import { ALL_VENUE_TEMPLATES } from "settings";
import { useFirestore } from "react-redux-firebase";
import "../Venue.scss";
import { Venue } from "types/Venue";
import { useParams, useHistory } from "react-router-dom";
import { VenueTemplate } from "types/VenueTemplate";
import { CampVenue } from "types/CampVenue";
import {
  CampContainer,
  CustomDragLayer,
  SubVenueIconMap,
} from "pages/Account/Venue/VenueMapEdition";
import * as Yup from "yup";
import { validationSchema } from "./RoomsValidationSchema";
import { useForm } from "react-hook-form";
import { ImageInput } from "components/molecules/ImageInput";
import { useUser } from "hooks/useUser";
import { upsertRoom, RoomInput } from "api/admin";
import { useQuery } from "hooks/useQuery";
import { ExtractProps } from "types/utility";
import AuthenticationModal from "components/organisms/AuthenticationModal";

export const RoomsForm: React.FC = () => {
  const { venueId } = useParams();
  const history = useHistory();
  const { user } = useUser();
  const firestore = useFirestore();
  const [venue, setVenue] = useState<CampVenue>();
  const queryParams = useQuery();
  const queryRoomIndexString = queryParams.get("roomIndex");
  const queryRoomIndex = queryRoomIndexString
    ? parseInt(queryRoomIndexString)
    : undefined;

  useEffect(() => {
    const fetchVenueFromAPI = async () => {
      const venueSnapshot = await firestore
        .collection("venues")
        .doc(venueId)
        .get();
      if (!venueSnapshot.exists) return history.replace("/admin");
      const data = venueSnapshot.data() as Venue;
      //find the template
      const template = ALL_VENUE_TEMPLATES.find(
        (template) => data.template === template.template
      );
      if (!template || template.template !== VenueTemplate.themecamp) {
        history.replace("/admin");
      }
      setVenue(data as CampVenue);
    };
    fetchVenueFromAPI();
  }, [firestore, venueId, history]);
  const room = useMemo(() => {
    if (
      typeof queryRoomIndex === "undefined" ||
      !venue ||
      venue.rooms.length - 1 < queryRoomIndex
    )
      return undefined;
    return venue.rooms[queryRoomIndex];
  }, [queryRoomIndex, venue]);

  if (!venue) return null;

  if (!user) {
    return (
      <WithNavigationBar fullscreen>
        <AuthenticationModal show={true} onHide={() => {}} showAuth="login" />
      </WithNavigationBar>
    );
  }

  return (
    <WithNavigationBar fullscreen>
      <RoomInnerForm venueId={venueId} venue={venue} editingRoom={room} />
    </WithNavigationBar>
  );
};

interface RoomInnerForm {
  venueId: string;
  venue: CampVenue;
  editingRoom?: CampVenue["rooms"][number];
}

export type FormValues = Partial<Yup.InferType<typeof validationSchema>>;

const RoomInnerForm: React.FC<RoomInnerForm> = (props) => {
  const { venue, venueId, editingRoom } = props;

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
  } = useForm<FormValues>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    validationSchema: validationSchema,
    validationContext: { editing: !!editingRoom },
    defaultValues,
  });

  const { user } = useUser();
  const history = useHistory();

  const values = watch();
  const disable = isSubmitting;

  const onSubmit = useCallback(
    async (vals: Partial<FormValues>) => {
      if (!user) return;
      try {
        await upsertRoom(vals as RoomInput, venueId, user);
        history.push(`/admin/venue/${venueId}`);
      } catch (e) {
        console.error(e);
      }
    },
    [user, history, venueId]
  );

  useEffect(() => {
    register("x_percent");
    register("y_percent");
  }, [register]);

  const iconPositionFieldName = "iconPosition";
  const onBoxMove: ExtractProps<typeof CampContainer>["onChange"] = useCallback(
    (val) => {
      if (!(iconPositionFieldName in val)) return;
      const iconPos = val[iconPositionFieldName];
      setValue("x_percent", iconPos.left);
      setValue("y_percent", iconPos.top);
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
              left: values.x_percent || 0,
              top: values.y_percent || 0,
              url: imageUrl,
            },
          }
        : {},
    [imageUrl, values.x_percent, values.y_percent]
  );

  return (
    <div className="page">
      <div className="page-side">
        <div className="page-container-left">
          <div className="page-container-left-content">
            <form
              className="full-height-container"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="scrollable-content">
                <h4 className="italic">{`${
                  editingRoom ? "Edit your" : "Add a"
                } room`}</h4>
                <p className="small light" style={{ marginBottom: "2rem" }}>
                  You can update everything in this form at a later date on the
                  edit page
                </p>
                {!editingRoom ? (
                  <div className="input-container">
                    <div className="input-title">Name your Room</div>
                    <input
                      disabled={disable}
                      name="title"
                      ref={register}
                      className="align-left"
                      placeholder={`My room title`}
                    />
                    {errors.title && (
                      <span className="input-error">
                        {errors.title.message}
                      </span>
                    )}
                  </div>
                ) : (
                  <input
                    type="hidden"
                    name="title"
                    ref={register}
                    value={values.title}
                  />
                )}
                <div className="input-container">
                  <div className="input-title">Upload an icon photo</div>
                  <ImageInput
                    disabled={disable}
                    name={"image_file"}
                    image={values.image_file}
                    remoteUrlInputName={"image_url"}
                    remoteImageUrl={values.image_url}
                    containerClassName="input-square-container"
                    ref={register}
                    error={errors.image_file || errors.image_url}
                  />
                </div>
                <div className="input-container">
                  <div className="input-title">Give your room a subtitle</div>
                  <input
                    name="subtitle"
                    disabled={disable}
                    ref={register}
                    className="align-left"
                    placeholder={`My room subtitle`}
                  />
                  {errors.subtitle && (
                    <span className="input-error">
                      {errors.subtitle.message}
                    </span>
                  )}
                </div>
                <div className="input-container">
                  <div className="input-title">About your room</div>
                  <textarea
                    disabled={disable}
                    name={"about"}
                    ref={register}
                    className="wide-input-block input-centered align-left"
                    placeholder={"Describe your room in detail"}
                  />
                  {errors.about && (
                    <span className="input-error">{errors.about.message}</span>
                  )}
                </div>
                <div className="input-container">
                  <div className="input-title">The room url</div>
                  <input
                    disabled={disable}
                    name={"url"}
                    ref={register}
                    className="wide-input-block align-left"
                    placeholder={"The url this room will redirect to"}
                  />
                  {errors.url && (
                    <span className="input-error">{errors.url.message}</span>
                  )}
                </div>
              </div>
              <div className="page-container-left-bottombar">
                <div />
                <div>
                  <SubmitButton
                    editing={!!editingRoom}
                    isSubmitting={isSubmitting}
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="page-side preview">
        <div className="playa">
          {venue.mapBackgroundImageUrl && (
            <>
              <CampContainer
                coordinatesBoundary={100}
                onChange={onBoxMove}
                snapToGrid={false}
                iconsMap={currentRoomIcon}
                backgroundImage={
                  venue.mapBackgroundImageUrl || "/burn/Playa.jpeg"
                }
                iconImageStyle={styles.iconImage}
                venue={venue}
              />
              <CustomDragLayer
                snapToGrid={false}
                iconImageStyle={styles.draggableIconImage}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, CSSProperties> = {
  iconImage: {
    width: 60,
    height: 60,
    overflow: "hidden",
    borderRadius: 30,
  },
  draggableIconImage: {
    width: 70,
    height: 70,
    overflow: "hidden",
    borderRadius: 35,
  },
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
    <input
      className="btn btn-primary"
      type="submit"
      value={editing ? "Update room" : "Create room"}
    />
  );
};
