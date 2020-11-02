import { createUrlSafeName } from "api/admin";
import SubmitButton from "components/atoms/SubmitButton/SubmitButton";
import { ImageInput } from "components/molecules/ImageInput";
import { ImageCollectionInput } from "components/molecules/ImageInput/ImageCollectionInput";
import React from "react";
import { useForm, FieldErrors, ErrorMessage } from "react-hook-form";
import {
  BACKGROUND_IMG_TEMPLATES,
  BANNER_MESSAGE_TEMPLATES,
  ZOOM_URL_TEMPLATES,
  IFRAME_TEMPLATES,
  HAS_ROOMS_TEMPLATES,
} from "settings";
import { createJazzbar } from "types/Venue";
import { VenueTemplate } from "types/VenueTemplate";
import { venueLandingUrl } from "utils/url";
import { WizardState } from "../Venue/VenueWizard/redux/types";
import { VenueWizard } from "../Venue/VenueWizard/VenueWizard.types";
import { FormValues } from "./DetailsForm";

interface DetailsFormLeftProps {
  state: WizardState;
  previous: VenueWizard["previous"];
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
  const templateType = state.templatePage?.template?.name;
  const templateID = state.templatePage?.template?.template;

  const defaultVenue = createJazzbar({});

  const renderTagline = () => (
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
  );

  const renderDescription = () => (
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
  );

  const renderAdultRestriction = () => (
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
  );

  const renderBannerPhotoUpload = () => (
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
  );

  const renderSquareLogo = () => (
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
  );

  const renderPlacementRequest = () => (
    <div className="input-container">
      <h4 className="italic" style={{ fontSize: "20px" }}>
        Placement Requests
      </h4>
      <div style={{ fontSize: "16px" }}>
        SparkleVerse&apos;s placement team will put your venue in an appropriate
        location before the burn. If you wish to be placed somewhere specific,
        or give suggestions for the team, please write that here.
      </div>
      <textarea
        disabled={disable}
        name="placementRequests"
        ref={register}
        className="wide-input-block input-centered align-left"
        placeholder="On the Esplanade!"
      />
      {errors.placementRequests && (
        <span className="input-error">{errors.placementRequests.message}</span>
      )}
    </div>
  );

  const renderLiveSchedule = () => (
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
  );

  const renderBackButtonSetup = () => (
    <div className="input-container">
      <h4 className="italic" style={{ fontSize: "20px" }}>
        Enter the ID of the venue you would like for the &quot;back&quot; button
      </h4>
      <div style={{ fontSize: "16px" }}>
        The nav bar can show a &quot;back&quot; button. Enter the venue ID you
        wish to use. A venue ID is the part of the URL after /in/, so eg. for
        sparkle.space/in/abcdef you would enter abcdef below
      </div>
      <input
        type="text"
        disabled={disable}
        name="parentId"
        ref={register}
        className="wide-input-block input-centered align-left"
        placeholder="abcdef"
      />
      {errors.parentId && (
        <span className="input-error">{errors.parentId.message}</span>
      )}
    </div>
  );

  const renderRoomAppearanceOnMap = () => (
    <>
      <h4 className="italic" style={{ fontSize: "20px" }}>
        Choose how you&apos;d like your rooms to appear on the map
      </h4>
      <div className="input-container">
        <select name="roomVisibility" ref={register}>
          <option value="hover">Hover</option>
          <option value="count">Count</option>
          <option value="count/name">Count and names</option>
        </select>
      </div>
    </>
  );

  const renderVenueName = () =>
    !editing ? (
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
        <input type="hidden" name="name" ref={register} value={values.name} />
        <span className="input-info">
          The URL of your venue will be: <b>{urlSafeName}</b>
        </span>
      </div>
    );

  const renderAnnouncement = () => (
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
        <span className="input-error">{errors.bannerMessage.message}</span>
      )}
    </>
  );

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

        {renderVenueName()}

        {renderTagline()}
        {renderDescription()}
        {renderAdultRestriction()}
        {renderBannerPhotoUpload()}
        {renderSquareLogo()}

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

        {templateID &&
          BANNER_MESSAGE_TEMPLATES.includes(templateID) &&
          renderAnnouncement()}
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

        {renderPlacementRequest()}
        {renderLiveSchedule()}
        {renderBackButtonSetup()}

        {templateID &&
          HAS_ROOMS_TEMPLATES.includes(templateID) &&
          renderRoomAppearanceOnMap()}
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
          <div>One or more errors occurred when saving the form:</div>
          {Object.keys(errors).map((fieldName) => (
            <div key={fieldName}>
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
            loading={isSubmitting}
            editing={editing}
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
          {Object.keys(errors).map((fieldName) => (
            <div key={fieldName}>
              <span>Error in {fieldName}:</span>
              <ErrorMessage
                errors={errors}
                name={fieldName as any}
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

export default DetailsFormLeft;
