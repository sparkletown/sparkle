import React, { useCallback, useEffect } from "react";
import { Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";

import { DEFAULT_VENUE_LOGO } from "settings";

import { createUrlSafeName, createVenue_v2, updateVenue_v2 } from "api/admin";

import { VenueTemplate } from "types/venues";

import { adminWorldSpacesUrl, venueLandingUrl } from "utils/url";
import { createJazzbar } from "utils/venue";

import { useUser } from "hooks/useUser";
import { useWorldEditParams } from "hooks/useWorldEditParams";

import {
  setBannerURL,
  setSquareLogoUrl,
} from "pages/Admin/Venue/VenueWizard/redux/actions";
import { SET_FORM_VALUES } from "pages/Admin/Venue/VenueWizard/redux/actionTypes";

import { ButtonNG } from "components/atoms/ButtonNG";
import ImageInput from "components/atoms/ImageInput";

import { validationSchema_v2 } from "../ValidationSchema";

import { DetailsFormProps, FormValues } from "./DetailsForm.types";

import "./DetailsForm.scss";

const DetailsForm: React.FC<DetailsFormProps> = ({ dispatch, editData }) => {
  const history = useHistory();
  const { user } = useUser();

  const { worldId } = useWorldEditParams();

  const setVenue = useCallback(
    async (vals: FormValues) => {
      if (!user || !worldId) return;

      try {
        if (worldId) {
          const updatedVenue = {
            ...vals,
            worldId,
          };

          await updateVenue_v2(updatedVenue, user);

          history.push(adminWorldSpacesUrl(worldId));
        } else {
          const newVenue = {
            ...vals,
            id: createUrlSafeName(vals.name),
            worldId,
          };

          await createVenue_v2(newVenue, user);

          history.push(adminWorldSpacesUrl(worldId));
        }
      } catch (e) {
        console.error(e);
      }
    },
    [user, worldId, history]
  );

  const {
    watch,
    formState: { isSubmitting, dirty },
    register,
    setValue,
    errors,
    handleSubmit,
    triggerValidation,
  } = useForm<FormValues>({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    validationSchema: validationSchema_v2,
    validationContext: {
      editing: !!worldId,
    },
  });

  const values = watch();

  const urlSafeName = values.name
    ? `${window.location.host}${venueLandingUrl(
        createUrlSafeName(values.name)
      )}`
    : undefined;
  const disable = isSubmitting;

  // @debt Should this be hardcoded here like this? At the very least maybe it should reference a constant/be defined outside of this component render
  const templateID = VenueTemplate.partymap;
  const nameDisabled = isSubmitting || !!worldId;

  const defaultVenue = createJazzbar({});

  useEffect(() => {
    if (editData) {
      setValue([
        { name: editData?.name },
        { subtitle: editData?.subtitle },
        { description: editData?.description },
        { bannerImageUrl: editData?.bannerImageUrl ?? "" },
        { logoImageUrl: editData?.logoImageUrl ?? DEFAULT_VENUE_LOGO },
        { showGrid: editData?.showGrid },
      ]);
    }
  }, [editData, setValue]);

  const handleBannerUpload = (url: string) => {
    setBannerURL(dispatch, url);
    void triggerValidation();
  };

  const handleLogoUpload = (url: string) => {
    setSquareLogoUrl(dispatch, url);
    void triggerValidation();
  };

  const renderVenueName = () => (
    <div className="DetailsForm__input-container">
      <h4 className="italic">Name your space</h4>
      <input
        disabled={disable || !!worldId}
        name="name"
        ref={register}
        className="align-left"
        placeholder="My Space Name"
        style={{ cursor: nameDisabled ? "disabled" : "text" }}
      />
      {errors.name ? (
        <span className="input-error">{errors.name.message}</span>
      ) : urlSafeName ? (
        <span className="DetailsForm__input-info">
          The URL of your space will be: <b>{urlSafeName}</b>
        </span>
      ) : null}
    </div>
  );

  const renderSubtitle = () => (
    <div className="DetailsForm__input-container">
      <h4 className="italic">Space subtitle</h4>
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
    <div className="DetailsForm__input-container">
      <h4 className="italic">Space description</h4>
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

  const renderHighlightImageUpload = () => (
    <div className="DetailsForm__input-container">
      <h4 className="italic">Upload Highlight image</h4>
      <ImageInput
        onChange={handleBannerUpload}
        name="bannerImage"
        error={errors.bannerImageFile || errors.bannerImageUrl}
        setValue={setValue}
        register={register}
        imgUrl={values.bannerImageUrl}
        isInputHidden={!values.bannerImageUrl}
        text="Upload Highlight image"
      />
    </div>
  );

  const renderLogoUpload = () => (
    <div className="DetailsForm__input-container">
      <h4 className="italic">Upload your logo</h4>
      <ImageInput
        onChange={handleLogoUpload}
        name="logoImage"
        small
        error={errors.logoImageFile || errors.logoImageUrl}
        setValue={setValue}
        register={register}
        imgUrl={values.logoImageUrl}
        isInputHidden={!values.logoImageUrl}
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
    <Form
      onSubmit={handleSubmit(setVenue)}
      onChange={handleOnChange}
      className="DetailsForm"
    >
      <div className="DetailsForm__wrapper">
        <input
          type="hidden"
          name="template"
          value={templateID}
          ref={register}
        />
        <h4 className="italic" style={{ fontSize: "30px" }}>
          {worldId ? "Edit your space" : "Create your space"}
        </h4>
        <p
          className="small light"
          style={{ marginBottom: "2rem", fontSize: "16px" }}
        >
          You can change anything except for the name of your space later
        </p>

        {renderVenueName()}
        {renderSubtitle()}
        {renderDescription()}
        {renderHighlightImageUpload()}
        {renderLogoUpload()}
      </div>

      <div className="DetailsForm__footer">
        <ButtonNG
          variant="primary"
          disabled={isSubmitting || !dirty}
          type="submit"
          loading={isSubmitting}
        >
          {worldId ? "Update Space" : "Create Space"}
        </ButtonNG>
      </div>
    </Form>
  );
};

export default DetailsForm;
