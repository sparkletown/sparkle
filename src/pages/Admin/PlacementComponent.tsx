import React, {
  useState,
  CSSProperties,
  useMemo,
  useEffect,
  useCallback,
} from "react";
import firebase, { UserInfo } from "firebase/app";
import { WithId } from "utils/id";
import { Venue } from "types/Venue";
import { PLAYA_WIDTH_AND_HEIGHT } from "settings";
import { useFirestoreConnect } from "react-redux-firebase";
import { useSelector } from "hooks/useSelector";
import { PlayaContainer } from "pages/Account/Venue/VenueMapEdition";
import {
  editPlacementCastSchema,
  validationSchema,
} from "./Venue/DetailsValidationSchema";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { useUser } from "hooks/useUser";
import { useHistory } from "react-router-dom";
import _ from "lodash";
import { PlacementInput } from "api/admin";
import { ImageCollectionInput } from "components/molecules/ImageInput/ImageCollectionInput";

type FormValues = Partial<Yup.InferType<typeof editPlacementCastSchema>>;

const createFirestorePlacementInput = async (
  input: PlacementInput,
  user: UserInfo
) => {
  const storageRef = firebase.storage().ref();

  const fileKey = "mapIconImageFile";
  const urlKey = "mapIconImageUrl";

  const fileArr = input[fileKey];
  if (!fileArr || fileArr.length === 0) {
    return { placement: input.placement };
  }
  const file = fileArr[0];

  const randomPrefix = Math.random().toString();

  const uploadFileRef = storageRef.child(
    `users/${user.uid}/placement/${randomPrefix}-${file.name}`
  );

  await uploadFileRef.put(file);
  const downloadUrl: string = await uploadFileRef.getDownloadURL();

  return {
    mapIconImageUrl: downloadUrl,
    placement: input.placement,
  };
};

const updatePlacement = async (input: PlacementInput, user: UserInfo) => {
  const firestorePlacementInput = await createFirestorePlacementInput(
    input,
    user
  );

  return await firebase.functions().httpsCallable("venue-adminUpdatePlacement")(
    firestorePlacementInput
  );
};

const iconPositionFieldName = "iconPosition";

const PlacementComponent: React.FC = () => {
  const [venueId, setVenueId] = useState();

  useFirestoreConnect({
    collection: "venues",
    storeAs: "playaVenues",
  });

  const venues = useSelector((state) => state.firestore.ordered.playaVenues);
  const venue = venues?.find((venue) => venue.id === venueId);

  const defaultValues = useMemo(
    () =>
      !!venue
        ? editPlacementCastSchema.cast(venue)
        : editPlacementCastSchema.cast(),
    [venue]
  );

  const { watch, formState, register, setValue, ...rest } = useForm<FormValues>(
    {
      mode: "onSubmit",
      reValidateMode: "onChange",
      validationSchema: editPlacementCastSchema,
      validationContext: {
        template: venue?.template,
        editing: !!venue,
      },
      defaultValues,
    }
  );
  const { user } = useUser();
  const history = useHistory();
  const { isSubmitting } = formState;
  const values = watch();

  const [formError, setFormError] = useState(false);

  //register the icon position data
  useEffect(() => {
    register("placement");
  }, [register]);

  const onSubmit = useCallback(
    async (vals: Partial<FormValues>) => {
      if (!user || !venue) return;
      try {
        // unfortunately the typing is off for react-hook-forms.
        await updatePlacement(vals as PlacementInput, user);
        setVenueId(undefined);
      } catch (e) {
        setFormError(true);
        console.error(e);
      }
    },
    [user, venueId, history]
  );

  const onFormSubmit = rest.handleSubmit(onSubmit);
  const mapIconUrl = useMemo(() => {
    const file = values.mapIconImageFile;
    if (file && file.length > 0) return URL.createObjectURL(file[0]);
    return values.mapIconImageUrl;
  }, [values.mapIconImageFile, values.mapIconImageUrl]);
  const iconsMap = useMemo(
    () =>
      mapIconUrl
        ? {
            [iconPositionFieldName]: {
              top: defaultValues?.placement?.y ?? 0,
              left: defaultValues?.placement?.x ?? 0,
              url: mapIconUrl,
            },
          }
        : undefined,
    [mapIconUrl, defaultValues]
  );

  return (
    <div className="page-container-adminpanel-venuepage">
      <div className="page-container-adminpanel-content">
        <div className="venue-preview">
          <h4 className="heading">Drag-and-Drop Playa Placement</h4>
          <form onSubmit={onSubmit}>
            {venueId && (
              <div className="content-group">
                <div className="title">Selected venue: {venue?.name}</div>
                <h4 className="italic" style={{ fontSize: "20px" }}>
                  Venue icon which will appear on the map
                </h4>
                <ImageCollectionInput
                  collectionPath={"assets/mapIcons2"}
                  disabled={false}
                  fieldName={"mapIconImage"}
                  register={register}
                  imageUrl={mapIconImageUrl}
                  containerClassName="input-square-container"
                  imageClassName="input-square-image"
                  image={mapIconImageFile}
                  error={errors.mapIconImageFile || errors.mapIconImageUrl}
                  setValue={setValue}
                  imageType="icons"
                />
              </div>
            )}
            <div className="content-group">
              <h4 className="italic" style={{ fontSize: "20px" }}>
                Location on the map
              </h4>
              <div className="playa">
                <PlayaContainer
                  interactive
                  coordinatesBoundary={PLAYA_WIDTH_AND_HEIGHT}
                  onChange={onChange}
                  snapToGrid={false}
                  iconsMap={iconsMap ?? {}}
                  backgroundImage={"/burn/Playa.jpeg"}
                  iconImageStyle={styles.iconImage}
                  draggableIconImageStyle={styles.draggableIconImage}
                  venueId={venueId}
                  otherIconsStyle={{ opacity: 0.4 }}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="page-container-adminpanel-sidebar">
        <div className="title">Selected Venue</div>
        <ul className="venuelist">
          {!venue && <li>(no venue selected)</li>}
          {venue && <li className="selected">{venue.name}</li>}
        </ul>
        <div className="title">Unplaced Venues</div>
        {unplacedVenues?.map((venue) => (
          <li
            onClick={() => setVenueId(venue.id)}
            className={venue.id === venueId ? "selected" : ""}
          >
            {venue.name}
          </li>
        ))}
        <div className="title">Self-placed Venues</div>
        <ul className="venuelist">
          {selfPlacedVenues?.map((venue) => (
            <li
              onClick={() => setVenueId(venue.id)}
              className={venue.id === venueId ? "selected" : ""}
            >
              {venue.name}
            </li>
          ))}
        </ul>
        <div className="title">Formally Placed Venues</div>
        <ul className="venuelist">
          {placedVenues?.map((venue) => (
            <li
              onClick={() => setVenueId(venue.id)}
              className={venue.id === venueId ? "selected" : ""}
            >
              {venue.name}
            </li>
          ))}
        </ul>
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

export default PlacementComponent;
