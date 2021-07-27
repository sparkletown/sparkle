import React, {
  useCallback,
  useMemo,
  useEffect,
  useState,
  useRef,
} from "react";
import { ErrorMessage, FieldErrors, useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { Form } from "react-bootstrap";
import Bugsnag from "@bugsnag/js";
import "firebase/functions";
import * as Yup from "yup";

import {
  createUrlSafeName,
  createVenue,
  updateVenue,
  VenueInput,
} from "api/admin";

import {
  ZOOM_URL_TEMPLATES,
  IFRAME_TEMPLATES,
  PLAYA_IMAGE,
  PLAYA_VENUE_SIZE,
  PLAYA_VENUE_STYLES,
  PLAYA_VENUE_NAME,
  HAS_ROOMS_TEMPLATES,
  BANNER_MESSAGE_TEMPLATES,
  PLAYA_WIDTH,
  PLAYA_HEIGHT,
  HAS_GRID_TEMPLATES,
  BACKGROUND_IMG_TEMPLATES,
} from "settings";

import { IS_BURN } from "secrets";

import { AnyVenue, VenuePlacementState, VenueTemplate } from "types/venues";
import { ExtractProps } from "types/utility";

import { isTruthy } from "utils/types";
import { venueLandingUrl } from "utils/url";
import { createJazzbar } from "utils/venue";

import { useUser } from "hooks/useUser";
import { useSovereignVenue } from "hooks/useSovereignVenue";

import { ImageInput } from "components/molecules/ImageInput";
import { ImageCollectionInput } from "components/molecules/ImageInput/ImageCollectionInput";

import { PlayaContainer } from "pages/Account/Venue/VenueMapEdition";

import {
  editVenueCastSchema,
  validationSchema,
} from "./DetailsValidationSchema";
import { WizardPage } from "./VenueWizard";

// @debt refactor any needed styles out of this file (eg. toggles, etc) and into DetailsForm.scss/similar, then remove this import
import "../Admin.scss";

import "./Venue.scss";

export type FormValues = Partial<Yup.InferType<typeof validationSchema>>; // bad typing. If not partial, react-hook-forms should force defaultValues to conform to FormInputs but it doesn't

interface DetailsFormProps extends WizardPage {
  venueId?: string;
}

const iconPositionFieldName = "iconPosition";

// @debt Refactor this constant into settings, or types/templates, or similar?
// @debt remove reference to legacy 'Theme Camp' here, both should probably just
//  display the same text as themecamp is now essentially just an alias of partymap
const backgroundTextByVenue: Record<string, string> = {
  [VenueTemplate.themecamp]: "Theme Camp",
  [VenueTemplate.partymap]: "Party Map",
};

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

  const { sovereignVenue } = useSovereignVenue({ venueId });

  const {
    watch,
    formState,
    register,
    setValue,
    control,
    handleSubmit,
    errors,
    setError,
  } = useForm<FormValues>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    validationSchema: validationSchema,
    validationContext: {
      template: state.templatePage?.template,
      editing: !!venueId,
    },
    defaultValues: {
      ...defaultValues,
      parentId: "/playa",
    },
  });
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

  // @debt refactor this to split it into more manageable chunks, most likely with some things pulled into the api/* layer
  // @debt refactor this to use useAsync or useAsyncFn as appropriate
  const onSubmit = useCallback(
    async (vals: Partial<FormValues>) => {
      if (!user || formError) return;
      try {
        // unfortunately the typing is off for react-hook-forms.
        if (venueId) {
          await updateVenue(
            {
              ...(vals as VenueInput),
              id: venueId,
            },
            user
          );
        } else
          await createVenue(
            {
              ...vals,
              parentId: "/playa",
            } as VenueInput,
            user
          );

        vals.name
          ? history.push(`/admin/${createUrlSafeName(venueId ?? vals.name)}`)
          : history.push(`/admin`);
      } catch (e) {
        setFormError(true);
        Bugsnag.notify(e, (event) => {
          event.addMetadata("Admin::Venue::DetailsForm::onSubmit", {
            venueId,
            vals,
          });
        });
      }
    },
    [user, formError, venueId, history]
  );

  const iconsMap = useMemo(
    () => ({
      [iconPositionFieldName]: {
        width: PLAYA_VENUE_SIZE,
        height: PLAYA_VENUE_SIZE,
        top: defaultValues?.placement?.y ?? 0,
        left: defaultValues?.placement?.x ?? 0,
      },
    }),
    [defaultValues]
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

  useEffect(() => {
    if (!previous || isTruthy(state.templatePage)) return;

    previous();
  }, [previous, state.templatePage]);

  if (!state.templatePage) {
    // In reality users should never actually see this, since the useEffect above should navigate us back to ?page=1
    return <>Error: state.templatePage not defined.</>;
  }

  const isAdminPlaced =
    state.detailsPage?.venue?.placement?.state ===
    VenuePlacementState.AdminPlaced;
  const placementAddress = state.detailsPage?.venue?.placement?.addressText;

  // @debt refactor any needed styles out of Admin.scss (eg. toggles, etc) and into DetailsForm.scss/similar, then remove the admin-dashboard class from this container
  return (
    <div className="page page--admin admin-dashboard">
      <div className="page-side page-side--admin">
        <div className="page-container-left page-container-left">
          <div className="page-container-left-content">
            <DetailsFormLeft
              venueId={venueId}
              setValue={setValue}
              state={state}
              previous={previous}
              values={values}
              sovereignVenue={sovereignVenue}
              isSubmitting={isSubmitting}
              register={register}
              watch={watch}
              onSubmit={onSubmit}
              editing={!!venueId}
              formError={formError}
              setFormError={setFormError}
              control={control}
              handleSubmit={handleSubmit}
              errors={errors}
              setError={setError}
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
  venueId?: string;
  sovereignVenue?: AnyVenue;
  state: WizardPage["state"];
  previous: WizardPage["previous"];
  values: FormValues;
  isSubmitting: boolean;
  register: ReturnType<typeof useForm>["register"];
  watch: ReturnType<typeof useForm>["watch"];
  control: ReturnType<typeof useForm>["control"];
  onSubmit: (vals: Partial<FormValues>) => Promise<void>;
  handleSubmit: ReturnType<typeof useForm>["handleSubmit"];
  errors: FieldErrors<FormValues>;
  setError: ReturnType<typeof useForm>["setError"];
  editing?: boolean;
  setValue: ReturnType<typeof useForm>["setValue"];
  formError: boolean;
  setFormError: (value: boolean) => void;
}

const DetailsFormLeft: React.FC<DetailsFormLeftProps> = ({
  sovereignVenue,
  editing,
  state,
  values,
  isSubmitting,
  register,
  errors,
  previous,
  onSubmit,
  handleSubmit,
  setValue,
  formError,
}) => {
  const urlSafeName = values.name
    ? `${window.location.host}${venueLandingUrl(
        createUrlSafeName(values.name)
      )}`
    : undefined;
  const disable = isSubmitting;
  const templateType = state.templatePage?.template.name;
  const templateID = state.templatePage?.template.template;

  const defaultVenue = createJazzbar({});

  const renderVenueNameInput = () => {
    return !editing ? (
      <div className="input-container">
        <h4 className="italic input-header">Name your {templateType}</h4>
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
        <h4 className="italic input-header">
          Your {templateType}: {values.name}
        </h4>
        <input type="hidden" name="name" ref={register} value={values.name} />
        <span className="input-info">
          The URL of your venue will be: <b>{urlSafeName}</b>
        </span>
      </div>
    );
  };

  const renderTaglineInput = () => (
    <div className="input-container">
      <h4 className="italic input-header">The venue tagline</h4>
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
  );

  const renderDescriptionInput = () => (
    <div className="input-container">
      <h4 className="italic input-header">Long description</h4>
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
  );

  const renderBannerPhotoInput = () => (
    <div className="input-container">
      <h4 className="italic input-header">Upload a banner photo</h4>
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
  );

  const renderLogoInput = () => (
    <div className="input-container">
      <h4 className="italic input-header">Upload a logo</h4>
      <ImageInput
        disabled={disable}
        ref={register}
        image={values.logoImageFile}
        remoteUrlInputName={"logoImageUrl"}
        remoteImageUrl={values.logoImageUrl}
        name={"logoImageFile"}
        containerClassName="host-icon-container"
        imageClassName="host-icon"
        error={errors.logoImageFile || errors.logoImageUrl}
      />
    </div>
  );

  const renderAnnouncementInput = () => (
    <>
      <h4 className="italic input-header">
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
        <span className="input-error">{errors.bannerMessage.message}</span>
      )}
    </>
  );

  const renderUrlInput = () => (
    <div className="input-container">
      <h4 className="italic input-header">URL</h4>
      <div style={{ fontSize: "16px" }}>
        Please post a URL to, for example, a Zoom room, Twitch stream, other
        Universe, or any interesting thing out there on the open web.
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
  );

  const renderLivestreamUrlInput = () => (
    <div className="input-container">
      <div className="input-title">
        Livestream URL, or embed URL, for people to view in your venue
      </div>
      <div className="input-title">
        (Enter an embeddable URL link. You can edit this later so you can leave
        a placeholder for now)
      </div>
      <textarea
        disabled={disable}
        name={"iframeUrl"}
        ref={register}
        className="wide-input-block input-centered align-left"
        placeholder="https://youtu.be/embed/abcDEF987w"
      />
      {errors.iframeUrl && (
        <span className="input-error">{errors.iframeUrl.message}</span>
      )}
    </div>
  );

  const renderGridDimensionsInputs = () => (
    <>
      <div className="input-container">
        <h4 className="italic input-header">Number of columns</h4>
        <input
          disabled={disable}
          defaultValue={1}
          name="columns"
          type="number"
          ref={register}
          className="align-left"
          placeholder={`Number of grid columns`}
        />
        {errors.columns ? (
          <span className="input-error">{errors.columns.message}</span>
        ) : null}
      </div>
      <div className="input-container">
        <h4 className="italic input-header">Number of rows</h4>
        <div>
          Not editable. The number of rows is derived from the number of
          specified columns and the width:height ratio of the party map, to keep
          the two aligned.
        </div>
      </div>
    </>
  );

  const renderRoomAppearanceSelect = () => (
    <>
      <h4 className="italic input-header">
        Choose how you&apos;d like your rooms to appear on the map
      </h4>
      <div className="input-container">
        <Form.Control as="select" name="roomVisibility" ref={register} custom>
          <option value="hover">Hover</option>
          <option value="count">Count</option>
          <option value="count/name">Count and names</option>
        </Form.Control>
      </div>
    </>
  );

  const renderMapBackgroundInput = (templateID: string) => (
    <div className="input-container">
      <h4 className="italic input-header">
        {`Choose the background for your ${
          backgroundTextByVenue[templateID] ?? "Experience"
        }`}
      </h4>

      <ImageCollectionInput
        collectionPath={"assets/mapBackgrounds"}
        containerClassName="input-square-container"
        disabled={disable}
        error={errors.mapBackgroundImageFile || errors.mapBackgroundImageUrl}
        fieldName={"mapBackgroundImage"}
        image={values.mapBackgroundImageFile}
        imageClassName="input-square-image"
        imageType="backgrounds"
        imageUrl={values.mapBackgroundImageUrl}
        register={register}
        setValue={setValue}
      />
    </div>
  );

  const renderHelper = (text: string) => (
    <p
      className="small light"
      style={{ marginBottom: "2rem", fontSize: "16px" }}
    >
      {text}
    </p>
  );

  return (
    <form className="full-height-container" onSubmit={handleSubmit(onSubmit)}>
      <input type="hidden" name="template" value={templateID} ref={register} />
      <div className="scrollable-content">
        <h4 className="italic" style={{ fontSize: "30px" }}>{`${
          editing ? "Edit" : "Create"
        } your ${templateType}`}</h4>
        {renderHelper(
          "You can change anything except for the name of your venue later"
        )}

        {renderVenueNameInput()}
        {renderTaglineInput()}
        {renderDescriptionInput()}

        {renderBannerPhotoInput()}
        {renderHelper("1:1 ratio recommended")}
        {renderLogoInput()}

        {templateID &&
          BANNER_MESSAGE_TEMPLATES.includes(templateID) &&
          renderAnnouncementInput()}

        {templateID && (
          <>
            {ZOOM_URL_TEMPLATES.includes(templateID) && renderUrlInput()}
            {IFRAME_TEMPLATES.includes(templateID) &&
              renderLivestreamUrlInput()}
          </>
        )}

        {templateID &&
          BACKGROUND_IMG_TEMPLATES.includes(templateID) &&
          renderMapBackgroundInput(templateID)}

        {templateID &&
          HAS_GRID_TEMPLATES.includes(templateID) &&
          values.showGrid &&
          renderGridDimensionsInputs()}

        {templateID &&
          HAS_ROOMS_TEMPLATES.includes(templateID) &&
          renderRoomAppearanceSelect()}
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
          <SubmitButton
            editing={editing}
            isSubmitting={isSubmitting}
            templateType={templateType ?? "Venue"}
          />
        </div>
      </div>
      {templateID === VenueTemplate.themecamp && (
        <div style={{ textAlign: "center" }}>
          You&apos;ll be able to add rooms to your theme camp on the next page
        </div>
      )}
      {formError && (
        <div className="input-error">
          <div>One or more errors occurred when saving the form:</div>
          {Object.keys(errors).map((fieldName, index) => (
            <div key={index}>
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
      value={editing ? `Update ${templateType}` : "Build!"}
    />
  );
};
