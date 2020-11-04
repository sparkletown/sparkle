import React, { useCallback, useEffect, useMemo, useState } from "react";

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

import { editVenueCastSchema, venueSchema } from "../ValidationSchema";
import { FormValues } from "../Details.types";
import { useUser } from "hooks/useUser";
import { useHistory } from "react-router-dom";

import { SET_FORM_VALUES } from "pages/Admin/Venue/VenueWizard/redux/actionTypes";

import * as S from "./DetailsForm.styles";

const DetailsForm: React.FC<DetailsFormProps> = (props) => {
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
        : venueSchema.cast(),
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
    validationSchema: venueSchema,
    validationContext: {
      editing: !!venueId,
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

  const handleBannerUpload = (url: string) => setBannerURL(dispatch, url);

  const handleLogoUpload = (url: string) => setSquareLogoUrl(dispatch, url);

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
        onChange={handleBannerUpload}
        name="bannerImage"
        error={errors.bannerImageFile}
        forwardRef={register}
      />
    </div>
  );

  const renderSquareLogo = () => (
    <div className="input-container">
      <h4 className="italic" style={{ fontSize: "20px" }}>
        Upload a square logo
      </h4>
      <ImageInput
        onChange={handleLogoUpload}
        name="logoImage"
        small
        error={errors.logoImageFile}
        forwardRef={register}
      />
    </div>
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
      <form onSubmit={handleSubmit(onSubmit)} onChange={handleOnChange}>
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

            <SubmitButton
              editing={!!venueId}
              loading={isSubmitting}
              templateType="Venue"
            />
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

export default DetailsForm;
