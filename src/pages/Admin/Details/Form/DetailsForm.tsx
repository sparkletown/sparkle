import React, { useCallback, useEffect } from "react";
import { Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import classNames from "classnames";

import {
  createUrlSafeName,
  createVenue_v2,
  updateVenue_v2,
  VenueInput_v2,
} from "api/admin";

import { VenueTemplate } from "types/venues";

import { venueLandingUrl } from "utils/url";
import { createJazzbar } from "utils/venue";

import { useUser } from "hooks/useUser";
import { useVenueId } from "hooks/useVenueId";

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
  const venueId = useVenueId();
  const { user } = useUser();

  const onSubmit = useCallback(
    async (vals: FormValues) => {
      if (!user) return;

      try {
        // unfortunately the typing is off for react-hook-forms.
        if (venueId) await updateVenue_v2(vals as VenueInput_v2, user);
        else await createVenue_v2(vals as VenueInput_v2, user);

        if (vals.name) {
          history.push(`/admin-ng/venue/${createUrlSafeName(vals.name)}`);
        } else {
          history.push("/admin-ng");
        }
      } catch (e) {
        console.error(e);
      }
    },
    [user, venueId, history]
  );

  const {
    watch,
    formState: { isSubmitting, dirty },
    register,
    setValue,
    errors,
    handleSubmit,
  } = useForm<FormValues>({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    validationSchema: validationSchema_v2,
    validationContext: {
      editing: !!venueId,
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
  const nameDisabled = isSubmitting || !!venueId;

  const defaultVenue = createJazzbar({});

  useEffect(() => {
    if (editData && venueId) {
      setValue([
        { name: editData?.name },
        { subtitle: editData?.subtitle },
        { description: editData?.description },
        { bannerImageUrl: editData?.bannerImageUrl },
        { logoImageUrl: editData?.logoImageUrl },
        { showGrid: editData?.showGrid },
      ]);
    }
  }, [editData, setValue, values.columns, venueId]);

  const handleBannerUpload = (url: string) => setBannerURL(dispatch, url);

  const handleLogoUpload = (url: string) => setSquareLogoUrl(dispatch, url);

  const renderVenueName = () => (
    <div
      className={classNames({
        "DetailsForm__input-container": true,
        "DetailsForm__input-container--with-error": errors?.name,
      })}
    >
      <h4 className="DetailsForm__input-title">Name your party</h4>
      <input
        disabled={disable || !!venueId}
        name="name"
        ref={register}
        className="align-left"
        placeholder="My Party Name"
        style={{ cursor: nameDisabled ? "disabled" : "text" }}
      />
      {errors.name ? (
        <span className="input-error">{errors.name.message}</span>
      ) : urlSafeName ? (
        <div className="DetailsForm__input-info">
          The URL of your party will be: <b>{urlSafeName}</b>
        </div>
      ) : null}
    </div>
  );

  const renderSubtitle = () => (
    <div
      className={classNames({
        "DetailsForm__input-container": true,
        "DetailsForm__input-container--with-error": errors?.subtitle,
      })}
    >
      <h4 className="DetailsForm__input-title">Party subtitle</h4>
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
    <div
      className={classNames({
        "DetailsForm__input-container": true,
        "DetailsForm__input-container--with-error": errors?.description,
      })}
    >
      <h4 className="DetailsForm__input-title">Party description</h4>
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

  const renderBannerUpload = () => (
    <div className="DetailsForm__input-container">
      <h4 className="DetailsForm__input-title">Upload a banner photo</h4>
      <ImageInput
        onChange={handleBannerUpload}
        name="bannerImage"
        error={errors.bannerImageFile || errors.bannerImageUrl}
        forwardRef={register}
        imgUrl={editData?.bannerImageUrl}
      />
    </div>
  );

  const renderLogoUpload = () => (
    <div className="DetailsForm__input-container">
      <h4 className="DetailsForm__input-title">Upload your logo</h4>
      <ImageInput
        onChange={handleLogoUpload}
        name="logoImage"
        small
        error={errors.logoImageFile || errors.logoImageUrl}
        forwardRef={register}
        imgUrl={editData?.logoImageUrl}
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
      className="DetailsForm"
      onSubmit={handleSubmit(onSubmit)}
      onChange={handleOnChange}
    >
      <div className="DetailsForm__inner-container">
        <div className="DetailsForm__header">
          <h4 className="DetailsForm__form-title">
            {venueId ? "Edit your party" : "Create your party"}
          </h4>
          <p className="DetailsForm__form-description">
            You can change anything except for the name of your venue later
          </p>
        </div>

        <div className="DetailsForm__body">
          <input
            type="hidden"
            name="template"
            value={templateID}
            ref={register}
          />

          {renderVenueName()}
          {renderSubtitle()}
          {renderDescription()}
          {renderBannerUpload()}
          {renderLogoUpload()}
        </div>

        <div className="DetailsForm__footer">
          <ButtonNG
            disabled={isSubmitting || !dirty}
            type="submit"
            variant="primary"
          >
            Build
          </ButtonNG>
        </div>
      </div>
    </Form>
  );
};

export default DetailsForm;
