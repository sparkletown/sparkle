import React, {
  useCallback,
  useMemo,
  useEffect,
  useState,
  useRef,
} from "react";
import * as Yup from "yup";
import "firebase/functions";

// Components
import DetailsFormLeft from "./DetailsFormLeft";

// Pages
import { PlayaContainer } from "pages/Account/Venue/VenueMapEdition";

// Utils | Settings | Constants | Helpers
import {
  createUrlSafeName,
  createVenue,
  updateVenue,
  VenueInput,
} from "api/admin";
import {
  PLAYA_IMAGE,
  PLAYA_VENUE_SIZE,
  PLAYA_VENUE_STYLES,
  PLAYA_VENUE_NAME,
  PLAYA_WIDTH,
  PLAYA_HEIGHT,
} from "settings";
import { IS_BURN } from "secrets";

// Hooks
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { useUser } from "hooks/useUser";

// Types
import { ExtractProps } from "types/utility";
import { VenuePlacementState } from "types/Venue";
import { WizardState } from "../Venue/VenueWizard/redux/types";

// Validation Schemas
import {
  editVenueCastSchema,
  validationSchema,
} from "../Venue/DetailsValidationSchema";

// Styles
import "../Venue/Venue.scss";

export type FormValues = Partial<Yup.InferType<typeof validationSchema>>; // bad typing. If not partial, react-hook-forms should force defaultValues to conform to FormInputs but it doesn't

interface DetailsFormProps {
  previous?: () => void;
  state: WizardState;
  venueId?: string;
}

const iconPositionFieldName = "iconPosition";

const DetailsForm: React.FC<DetailsFormProps> = ({
  previous,
  state,
  venueId,
}) => {
  console.group('DetailsForm');
  console.log(venueId)
  console.log(state)
  console.groupEnd();
  const defaultValues = useMemo(
    () =>
      !!venueId
        ? editVenueCastSchema.cast(state.detailsPage?.venue)
        : validationSchema.cast(),
    [state.detailsPage, venueId]
  );

  const { watch, formState, register, setValue, ...rest } = useForm<FormValues>(
    {
      mode: "onSubmit",
      reValidateMode: "onChange",
      validationSchema: validationSchema,
      validationContext: {
        template: state.templatePage?.template,
        editing: !!venueId,
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

  const placementDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clientWidth = placementDivRef.current?.clientWidth ?? 0;
    const clientHeight = placementDivRef.current?.clientHeight ?? 0;

    placementDivRef.current?.scrollTo(
      (state.detailsPage?.venue?.placement?.x ?? 0) - clientWidth / 2,
      (state.detailsPage?.venue?.placement?.y ?? 0) - clientHeight / 2
    );
  }, [state.detailsPage]);

  const onSubmit = useCallback(
    async (vals: Partial<FormValues>) => {
      if (!user) return;
      try {
        // unfortunately the typing is off for react-hook-forms.
        if (!!venueId) await updateVenue(vals as VenueInput, user);
        else await createVenue(vals as VenueInput, user);

        vals.name
          ? history.push(`/admin/venue/${createUrlSafeName(vals.name)}`)
          : history.push(`/admin`);
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
              width: PLAYA_VENUE_SIZE,
              height: PLAYA_VENUE_SIZE,
              top: defaultValues?.placement?.y ?? 0,
              left: defaultValues?.placement?.x ?? 0,
              url: mapIconUrl,
            },
          }
        : undefined,
    [mapIconUrl, defaultValues]
  );

  const onBoxMove: ExtractProps<
    typeof PlayaContainer
  >["onChange"] = useCallback(
    (val) => {
      if (!(iconPositionFieldName in val)) return;
      const iconPos = val[iconPositionFieldName];
      setValue("placement", {
        x: iconPos.left,
        y: iconPos.top,
      });
    },
    [setValue]
  );

  if (!state.templatePage) {
    previous && previous();
    return null;
  }

  const isAdminPlaced =
    state.detailsPage?.venue?.placement?.state ===
    VenuePlacementState.AdminPlaced;
  const placementAddress = state.detailsPage?.venue?.placement?.addressText;

  return (
    <div className="page">
      <div className="page-side">
        <div className="page-container-left">
          <div
            className="page-container-left-content"
            style={{ maxWidth: "680px" }}
          >
            <DetailsFormLeft
              setValue={setValue}
              state={state}
              previous={previous}
              values={values}
              isSubmitting={isSubmitting}
              register={register}
              watch={watch}
              onSubmit={onFormSubmit}
              editing={!!venueId}
              formError={formError}
              {...rest}
            />
          </div>
        </div>
      </div>
      {!IS_BURN && (
        <div className="page-side preview" style={{ paddingBottom: "20px" }}>
          <h4
            className="italic"
            style={{ textAlign: "center", fontSize: "22px" }}
          >
            Position your venue on the {PLAYA_VENUE_NAME}
          </h4>
          {isAdminPlaced ? (
            <p className="warning">
              Your venue has been placed by our placement team and cannot be
              moved.{" "}
              {placementAddress && (
                <>
                  The placement team wrote your address as: {placementAddress}
                </>
              )}
            </p>
          ) : (
            <p>
              First upload or select the icon you would like to appear on the
              {PLAYA_VENUE_NAME}, then drag it around to position it. The
              placement team from SparkleVerse will place your camp later, after
              which you will need to reach out if you want it moved.
            </p>
          )}
          <div
            className="playa"
            ref={placementDivRef}
            style={{ width: "100%", height: 1000, overflow: "scroll" }}
          >
            <PlayaContainer
              rounded
              interactive={!isAdminPlaced}
              resizable={false}
              coordinatesBoundary={{
                width: PLAYA_WIDTH,
                height: PLAYA_HEIGHT,
              }}
              onChange={onBoxMove}
              snapToGrid={false}
              iconsMap={iconsMap ?? {}}
              backgroundImage={PLAYA_IMAGE}
              iconImageStyle={PLAYA_VENUE_STYLES.iconImage}
              draggableIconImageStyle={PLAYA_VENUE_STYLES.draggableIconImage}
              venueId={venueId}
              otherIconsStyle={{ opacity: 0.4 }}
              containerStyle={{
                width: PLAYA_WIDTH,
                height: PLAYA_HEIGHT,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailsForm;
