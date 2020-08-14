import React, { useEffect, useState, useMemo, useCallback } from "react";
import WithNavigationBar from "components/organisms/WithNavigationBar";
import { ALL_VENUE_TEMPLATES } from "settings";
import { useFirestore } from "react-redux-firebase";
import "../Venue.scss";
import { Venue } from "types/Venue";
import { useParams, useHistory } from "react-router-dom";
import { VenueTemplate } from "types/VenueTemplate";
import { CampVenue } from "types/CampVenue";
import {
  Container,
  CustomDragLayer,
} from "pages/Account/Venue/VenueMapEdition";
import * as Yup from "yup";
import { validationSchema } from "./RoomsValidationSchema";
import { useForm } from "react-hook-form";
import { ImageInput } from "components/molecules/ImageInput";

export const RoomsForm: React.FC = () => {
  const { venueId } = useParams();
  const history = useHistory();
  const firestore = useFirestore();
  const [venue, setVenue] = useState<CampVenue>();

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

  if (!venue) return null;

  return (
    <WithNavigationBar fullscreen>
      <RoomInnerForm venue={venue} />
    </WithNavigationBar>
  );
};

interface RoomInnerForm {
  venue: CampVenue;
  editing?: boolean;
}

export type FormValues = Partial<Yup.InferType<typeof validationSchema>>;

const RoomInnerForm: React.FC<RoomInnerForm> = (props) => {
  const { venue, editing } = props;

  const defaultValues = useMemo(() => validationSchema.cast(), []);

  const {
    watch,
    register,
    handleSubmit,
    errors,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    validationSchema: validationSchema,
    validationContext: { editing },
    defaultValues,
  });

  const values = watch();
  const disable = isSubmitting;

  const onSubmit = useCallback(async (vals: Partial<FormValues>) => {}, []);

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
                <h4 className="italic">Add a room</h4>
                <p className="small light" style={{ marginBottom: "2rem" }}>
                  You can update everything in this form at a later date on the
                  edit page
                </p>
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
                    <span className="input-error">{errors.title.message}</span>
                  )}
                </div>
                <div className="input-container">
                  <div className="input-title">Name your venue</div>
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
                  <div className="input-title">Upload a banner photo</div>
                  <ImageInput
                    disabled={disable}
                    name={"image_file"}
                    image={values.image_file}
                    remoteUrlInputName={"image_url"}
                    remoteImageUrl={values.image_url}
                    ref={register}
                    error={errors.image_file || errors.image_url}
                  />
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
                  <SubmitButton editing={editing} isSubmitting={isSubmitting} />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="page-side preview">
        <div className="playa">
          <Container
            onChange={() => {}}
            snapToGrid={false}
            iconsMap={{}}
            backgroundImage={venue.mapBackgroundImageUrl ?? "/burn/Playa.jpeg"}
            iconImageStyle={{}}
          />
          <CustomDragLayer snapToGrid={false} iconImageStyle={{}} />
        </div>
      </div>
    </div>
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
    <input
      className="btn btn-primary"
      type="submit"
      value={editing ? "Update room" : "Create room"}
    />
  );
};
