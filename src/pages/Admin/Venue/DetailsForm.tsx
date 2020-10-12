import {
  createUrlSafeName,
  createVenue,
  updateVenue,
  VenueInput,
} from "api/admin";
import { ImageInput } from "components/molecules/ImageInput";
import "firebase/functions";
import { useUser } from "hooks/useUser";
import React, {
  useCallback,
  useMemo,
  useEffect,
  useState,
  useRef,
} from "react";
import { ErrorMessage, FieldErrors, useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { createJazzbar, VenuePlacementState } from "types/Venue";
import * as Yup from "yup";
import {
  editVenueCastSchema,
  validationSchema,
} from "./DetailsValidationSchema";
import "./Venue.scss";
import { WizardPage } from "./VenueWizard";
import { venueLandingUrl } from "utils/url";
import {
  ZOOM_URL_TEMPLATES,
  IFRAME_TEMPLATES,
  BACKGROUND_IMG_TEMPLATES,
  PLAYA_IMAGE,
  PLAYA_VENUE_SIZE,
  PLAYA_VENUE_STYLES,
  PLAYA_VENUE_NAME,
  HAS_ROOMS_TEMPLATES,
  BANNER_MESSAGE_TEMPLATES,
  PLAYA_WIDTH,
  PLAYA_HEIGHT,
} from "settings";
import "./Venue.scss";
import { PlayaContainer } from "pages/Account/Venue/VenueMapEdition";
import { ImageCollectionInput } from "components/molecules/ImageInput/ImageCollectionInput";
import { ExtractProps } from "types/utility";
import { VenueTemplate } from "types/VenueTemplate";
import { IS_BURN } from "secrets";

export type FormValues = Partial<Yup.InferType<typeof validationSchema>>; // bad typing. If not partial, react-hook-forms should force defaultValues to conform to FormInputs but it doesn't

interface DetailsFormProps extends WizardPage {
  venueId?: string;
}

const iconPositionFieldName = "iconPosition";

export const DetailsForm: React.FC<DetailsFormProps> = ({
  previous,
  state,
  venueId,
}) => {
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
      (state?.detailsPage?.venue.placement?.x ?? 0) - clientWidth / 2,
      (state?.detailsPage?.venue.placement?.y ?? 0) - clientHeight / 2
    );
  }, [state]);

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
              {...rest}
              onSubmit={onFormSubmit}
              editing={!!venueId}
              formError={formError}
            />
          </div>
        </div>
      </div>
      {IS_BURN && (
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

interface DetailsFormLeftProps {
  state: WizardPage["state"];
  previous: WizardPage["previous"];
  values: FormValues;
  isSubmitting: boolean;
  register: ReturnType<typeof useForm>["register"];
  watch: ReturnType<typeof useForm>["watch"];
  control: ReturnType<typeof useForm>["control"];
  onSubmit: ReturnType<ReturnType<typeof useForm>["handleSubmit"]>;
  errors: FieldErrors<FormValues>;
  editing?: boolean;
  setValue: ReturnType<typeof useForm>["setValue"];
  formError: boolean;
}

const DetailsFormLeft: React.FC<DetailsFormLeftProps> = (props) => {
  const {
    editing,
    state,
    values,
    isSubmitting,
    register,
    watch,
    errors,
    previous,
    onSubmit,
    setValue,
    formError,
  } = props;

  const urlSafeName = values.name
    ? `${window.location.host}${venueLandingUrl(
        createUrlSafeName(values.name)
      )}`
    : undefined;
  const disable = isSubmitting;
  const templateType = state.templatePage?.template.name;
  const templateID = state.templatePage?.template.template;

  const defaultVenue = createJazzbar({});

  return (
    <form className="full-height-container" onSubmit={onSubmit}>
      <input type="hidden" name="template" value={templateID} ref={register} />
      <div className="scrollable-content">
        <h4 className="italic" style={{ fontSize: "30px" }}>{`${
          editing ? "Edit" : "Create"
        } your ${templateType}`}</h4>
        <p
          className="small light"
          style={{ marginBottom: "2rem", fontSize: "16px" }}
        >
          You can change anything except for the name of your venue later
        </p>
        {!editing ? (
          <div className="input-container">
            <h4 className="italic" style={{ fontSize: "20px" }}>
              Name your {templateType}
            </h4>
            <input
              disabled={disable}
              name="name"
              ref={register}
              className="align-left"
              placeholder={`My ${templateType} name`}
            />
            {errors.name ? (
              <span className="input-error">{errors.name.message}</span>
            ) : urlSafeName ? (
              <span className="input-info">
                The URL of your venue will be: <b>{urlSafeName}</b>
              </span>
            ) : null}
          </div>
        ) : (
          <div className="input-container">
            <h4 className="italic" style={{ fontSize: "20px" }}>
              Your {templateType}: {values.name}
            </h4>
            <input
              type="hidden"
              name="name"
              ref={register}
              value={values.name}
            />
            <span className="input-info">
              The URL of your venue will be: <b>{urlSafeName}</b>
            </span>
          </div>
        )}
        <div className="input-container">
          <h4 className="italic" style={{ fontSize: "20px" }}>
            The venue tagline
          </h4>
          <input
            disabled={disable}
            name={"subtitle"}
            ref={register}
            className="wide-input-block align-left"
            placeholder={defaultVenue.config?.landingPageConfig.subtitle}
          />
          {errors.subtitle && (
            <span className="input-error">{errors.subtitle.message}</span>
          )}
        </div>
        <div className="input-container">
          <h4 className="italic" style={{ fontSize: "20px" }}>
            Long description
          </h4>
          <textarea
            disabled={disable}
            name={"description"}
            ref={register}
            className="wide-input-block input-centered align-left"
            placeholder={defaultVenue.config?.landingPageConfig.description}
          />
          {errors.description && (
            <span className="input-error">{errors.description.message}</span>
          )}
        </div>
        <div className="input-container">
          <label
            htmlFor={"chkadultContent"}
            className={`checkbox ${
              watch("adultContent", false) && "checkbox-checked"
            }`}
          >
            Restrict entry to adults aged 18+
          </label>
          <input
            type="checkbox"
            id={"chkadultContent"}
            name={"adultContent"}
            defaultChecked={values.adultContent}
            ref={register}
          />
        </div>
        <div className="input-container">
          <h4 className="italic" style={{ fontSize: "20px" }}>
            Upload a banner photo
          </h4>
          <ImageInput
            disabled={disable}
            name={"bannerImageFile"}
            image={values.bannerImageFile}
            remoteUrlInputName={"bannerImageUrl"}
            remoteImageUrl={values.bannerImageUrl}
            ref={register}
            error={errors.bannerImageFile || errors.bannerImageUrl}
          />
        </div>
        <div className="input-container">
          <h4 className="italic" style={{ fontSize: "20px" }}>
            Upload a square logo
          </h4>
          <ImageInput
            disabled={disable}
            ref={register}
            image={values.logoImageFile}
            remoteUrlInputName={"logoImageUrl"}
            remoteImageUrl={values.logoImageUrl}
            name={"logoImageFile"}
            containerClassName="input-square-container"
            imageClassName="input-square-image"
            error={errors.logoImageFile || errors.logoImageUrl}
          />
        </div>
        <div className="input-container">
          <h4 className="italic" style={{ fontSize: "20px" }}>
            {`Choose how you'd like your venue to appear on the map`}
          </h4>
          <ImageCollectionInput
            collectionPath={"assets/mapIcons2"}
            disabled={disable}
            fieldName={"mapIconImage"}
            register={register}
            imageUrl={values.mapIconImageUrl}
            containerClassName="input-square-container"
            imageClassName="input-square-image"
            image={values.mapIconImageFile}
            error={errors.mapIconImageFile || errors.mapIconImageUrl}
            setValue={setValue}
            imageType="icons"
          />
          {templateID && BACKGROUND_IMG_TEMPLATES.includes(templateID) && (
            <>
              <h4 className="italic" style={{ fontSize: "20px" }}>
                {`Choose the background for your Theme Camp`}
              </h4>
              <ImageCollectionInput
                collectionPath={"assets/mapBackgrounds"}
                disabled={disable}
                fieldName={"mapBackgroundImage"}
                register={register}
                imageUrl={values.mapBackgroundImageUrl}
                containerClassName="input-square-container"
                imageClassName="input-square-image"
                image={values.mapBackgroundImageFile}
                error={
                  errors.mapBackgroundImageFile || errors.mapBackgroundImageUrl
                }
                setValue={setValue}
                imageType="backgrounds"
              />
            </>
          )}
        </div>
        {templateID && BANNER_MESSAGE_TEMPLATES.includes(templateID) && (
          <>
            <h4 className="italic" style={{ fontSize: "20px" }}>
              Show an announcement in the venue (or leave blank for none)
            </h4>
            <input
              type="text"
              disabled={disable}
              name="bannerMessage"
              ref={register}
              className="wide-input-block input-centered align-left"
              placeholder="Enter your announcement"
            />
            {errors.bannerMessage && (
              <span className="input-error">
                {errors.bannerMessage.message}
              </span>
            )}
          </>
        )}
        {templateID && (
          <>
            {ZOOM_URL_TEMPLATES.includes(templateID) && (
              <div className="input-container">
                <h4 className="italic" style={{ fontSize: "20px" }}>
                  URL
                </h4>
                <div style={{ fontSize: "16px" }}>
                  Please post a URL to, for example, a Zoom room, Twitch stream,
                  other Universe, or any interesting thing out there on the open
                  web.
                </div>
                <textarea
                  disabled={disable}
                  name={"zoomUrl"}
                  ref={register}
                  className="wide-input-block input-centered align-left"
                  placeholder="https://us02web.zoom.us/j/654123654123"
                />
                {errors.zoomUrl && (
                  <span className="input-error">{errors.zoomUrl.message}</span>
                )}
              </div>
            )}
            {IFRAME_TEMPLATES.includes(templateID) && (
              <div className="input-container">
                <div className="input-title">
                  Livestream URL, or embed URL, for people to view in your venue
                </div>
                <div className="input-title">
                  (Enter an embeddable URL link. You can edit this later so you
                  can leave a placeholder for now)
                </div>
                <textarea
                  disabled={disable}
                  name={"iframeUrl"}
                  ref={register}
                  className="wide-input-block input-centered align-left"
                  placeholder="https://youtu.be/embed/abcDEF987w"
                />
                {errors.iframeUrl && (
                  <span className="input-error">
                    {errors.iframeUrl.message}
                  </span>
                )}
              </div>
            )}
          </>
        )}
        <div className="input-container">
          <h4 className="italic" style={{ fontSize: "20px" }}>
            Placement Requests
          </h4>
          <div style={{ fontSize: "16px" }}>
            SparkleVerse's placement team will put your venue in an appropriate
            location before the burn. If you wish to be placed somewhere
            specific, or give suggestions for the team, please write that here.
          </div>
          <textarea
            disabled={disable}
            name="placementRequests"
            ref={register}
            className="wide-input-block input-centered align-left"
            placeholder="On the Esplanade!"
          />
          {errors.placementRequests && (
            <span className="input-error">
              {errors.placementRequests.message}
            </span>
          )}
        </div>
        {templateID === VenueTemplate.playa && (
          <div className="toggle-room">
            <h4 className="italic" style={{ fontSize: "20px" }}>
              Show live schedule
            </h4>
            <label id={"showLiveSchedule"} className="switch">
              <input
                type="checkbox"
                id={"showLiveSchedule"}
                name={"showLiveSchedule"}
                ref={register}
              />
              <span className="slider round"></span>
            </label>
          </div>
        )}
        {templateID && HAS_ROOMS_TEMPLATES.includes(templateID) && (
          <>
            <h4 className="italic" style={{ fontSize: "20px" }}>
              Choose how you'd like your rooms to appear on the map
            </h4>
            <div className="input-container">
              <select name="roomVisibility" ref={register}>
                <option value="hover">Hover</option>
                <option value="count">Count</option>
                <option value="count/names">Count and names</option>
              </select>
            </div>
          </>
        )}
      </div>
      <div className="page-container-left-bottombar">
        {previous ? (
          <button className="btn btn-primary nav-btn" onClick={previous}>
            Go Back
          </button>
        ) : (
          <div />
        )}
        <div>
          {Object.keys(errors).map((fieldName) => (
            <div>
              <span>Error in {fieldName}:</span>
              <ErrorMessage
                errors={errors}
                name={fieldName as any}
                as="span"
                key={fieldName}
              />
            </div>
          ))}
          <SubmitButton
            editing={editing}
            isSubmitting={isSubmitting}
            templateType={templateType ?? "Venue"}
          />
        </div>
      </div>
      {templateID === VenueTemplate.themecamp && (
        <div style={{ textAlign: "center" }}>
          {`You'll be able to add rooms to your theme camp on the next page`}
        </div>
      )}
      {formError && (
        <span className="input-error">
          {"An error occured when saving the form"}
        </span>
      )}
    </form>
  );
};

interface SubmitButtonProps {
  isSubmitting: boolean;
  editing?: boolean;
  templateType: string;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  isSubmitting,
  editing,
  templateType,
}) => {
  return isSubmitting ? (
    <div className="spinner-border">
      <span className="sr-only">Loading...</span>
    </div>
  ) : (
    <input
      className="btn btn-primary"
      type="submit"
      value={editing ? `Update ${templateType}` : `Create ${templateType}`}
    />
  );
};
