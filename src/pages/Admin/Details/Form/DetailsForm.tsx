import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

// API
import {
  createUrlSafeName,
  createVenue,
  updateVenue,
  VenueInput,
} from "api/admin";

// Components
import SubmitButton from "components/atoms/SubmitButton/SubmitButton";
import ImageInput from "components/atoms/ImageInput";

// Hooks
import { ErrorMessage, useForm } from "react-hook-form";

// Utils | Settings | Constants | Helpers
import {
  BANNER_MESSAGE_TEMPLATES,
  ZOOM_URL_TEMPLATES,
  IFRAME_TEMPLATES,
  HAS_ROOMS_TEMPLATES,
} from "settings";
import { venueLandingUrl } from "utils/url";

// Typings
import { createJazzbar } from "types/Venue";
import { VenueTemplate } from "types/VenueTemplate";

// Typings
import { DetailsFormProps } from "./DetailsForm.types";
import {
  setBannerURL,
  setSquareLogoUrl,
} from "pages/Admin/Venue/VenueWizard/redux/actions";

import { editVenueCastSchema, validationSchema } from "../ValidationSchema";
import { FormValues } from "../Details.types";
import { useUser } from "hooks/useUser";
import { useHistory } from "react-router-dom";

import { SET_FORM_VALUES } from "pages/Admin/Venue/VenueWizard/redux/actionTypes";

import * as S from "./DetailsForm.styles";

const DetailsFormLeft: React.FC<DetailsFormProps> = (props) => {
  const { venueId, dispatch, state } = props;

  const [formError, setFormError] = useState(false);
  const history = useHistory();
  const { user } = useUser();

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

  const defaultValues = useMemo(
    () =>
      !!venueId
        ? editVenueCastSchema.cast(state.formValues)
        : validationSchema.cast(),
    [state.formValues, venueId]
  );

  const {
    watch,
    formState,
    register,
    setValue,
    errors,
    handleSubmit,
  } = useForm<FormValues>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    validationSchema: validationSchema,
    validationContext: {
      template: VenueTemplate.partymap,
    },
    defaultValues,
  });

  const values = watch();
  const { isSubmitting } = formState;

  const urlSafeName = values.name
    ? `${window.location.host}${venueLandingUrl(
        createUrlSafeName(values.name)
      )}`
    : undefined;
  const disable = isSubmitting;
  const templateID = VenueTemplate.partymap;

  const defaultVenue = createJazzbar({});

  useEffect(() => {
    if (defaultValues && venueId) {
      setValue([
        { name: defaultValues?.name },
        { subtitle: defaultValues?.subtitle },
        { description: defaultValues?.description },
      ]);
    }
  }, [defaultValues, setValue, venueId]);

  const handleBannerUpload = (files: FileList | null) => {
    if (!files) return;

    setBannerURL(dispatch, URL.createObjectURL(files[0]));
  };

  const handleLogoUpload = (files: FileList | null) => {
    if (!files) return;

    setSquareLogoUrl(dispatch, URL.createObjectURL(files[0]));
  };

  const renderSubtitle = () => (
    <div className="input-container">
      <h4 className="italic" style={{ fontSize: "20px" }}>
        Party subtitle
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
        Party description
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

  const renderBannerPhotoUpload = () => (
    <div className="input-container">
      <h4 className="italic" style={{ fontSize: "20px" }}>
        Upload a banner photo
      </h4>
      <ImageInput
        onChange={(event) => handleBannerUpload(event.target.files)}
        name="bannerImageUrl"
        error={errors.bannerImageFile}
        forwardRef={register}
        imageURL={state?.bannerURL}
      />
    </div>
  );

  const renderSquareLogo = () => (
    <div className="input-container">
      <h4 className="italic" style={{ fontSize: "20px" }}>
        Upload a square logo
      </h4>
      <ImageInput
        onChange={(event) => handleLogoUpload(event.target.files)}
        name="logoImageUrl"
        small
        error={errors.logoImageFile || errors.logoImageUrl}
        forwardRef={register}
      />
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

  const renderVenueName = () => (
    <div className="input-container">
      <h4 className="italic" style={{ fontSize: "20px" }}>
        Name your party
      </h4>
      <input
        disabled={disable}
        name="name"
        ref={register}
        className="align-left"
        placeholder="My Party Name"
      />
      {errors.name ? (
        <span className="input-error">{errors.name.message}</span>
      ) : urlSafeName ? (
        <span className="input-info">
          The URL of your venue will be: <b>{urlSafeName}</b>
        </span>
      ) : null}
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

  const handleOnChange = () => {
    return dispatch({
      type: SET_FORM_VALUES,
      payload: {
        name: values.name,
        subtitle: values.subtitle,
        description: values.description,
      },
    });
  };

  return (
    <S.Wrapper>
      <form
        className="full-height-container"
        onSubmit={handleSubmit(onSubmit)}
        onChange={handleOnChange}
      >
        <input
          type="hidden"
          name="template"
          value={templateID}
          ref={register}
        />
        <div className="scrollable-content">
          <h4 className="italic" style={{ fontSize: "30px" }}>
            {venueId ? "Edit your Party Map" : "Create your Party Map"}
          </h4>
          <p
            className="small light"
            style={{ marginBottom: "2rem", fontSize: "16px" }}
          >
            You can change anything except for the name of your venue later
          </p>

          {renderVenueName()}

          {renderSubtitle()}
          {renderDescription()}
          {renderBannerPhotoUpload()}
          {renderSquareLogo()}

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
                    Please post a URL to, for example, a Zoom room, Twitch
                    stream, other Universe, or any interesting thing out there
                    on the open web.
                  </div>
                  <textarea
                    disabled={disable}
                    name={"zoomUrl"}
                    ref={register}
                    className="wide-input-block input-centered align-left"
                    placeholder="https://us02web.zoom.us/j/654123654123"
                  />
                  {errors.zoomUrl && (
                    <span className="input-error">
                      {errors.zoomUrl.message}
                    </span>
                  )}
                </div>
              )}
              {IFRAME_TEMPLATES.includes(templateID) && (
                <div className="input-container">
                  <div className="input-title">
                    Livestream URL, or embed URL, for people to view in your
                    venue
                  </div>
                  <div className="input-title">
                    (Enter an embeddable URL link. You can edit this later so
                    you can leave a placeholder for now)
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

          {templateID &&
            HAS_ROOMS_TEMPLATES.includes(templateID) &&
            renderRoomAppearanceOnMap()}
        </div>

        <div className="page-container-left-bottombar">
          <div>
            {Object.keys(errors).length > 0 && (
              <>
                <div>One or more errors occurred when saving the form:</div>
                {Object.keys(errors).map((fieldName) => (
                  <div key={fieldName}>
                    <span>Error in {fieldName}:</span>
                    <ErrorMessage
                      errors={errors}
                      name={fieldName as string}
                      as="span"
                      key={fieldName}
                    />
                  </div>
                ))}
              </>
            )}

            <SubmitButton editing={!!venueId} loading={isSubmitting} templateType="Venue" />
          </div>
        </div>

        {formError && (
          <div className="input-error">
            <div>One or more errors occurred when saving the form:</div>
            {Object.keys(errors).map((fieldName) => (
              <div key={fieldName}>
                <span>Error in {fieldName}:</span>
                <ErrorMessage
                  errors={errors}
                  name={fieldName as string}
                  as="span"
                  key={fieldName}
                />
              </div>
            ))}
          </div>
        )}
      </form>
    </S.Wrapper>
  );
};

export default DetailsFormLeft;
