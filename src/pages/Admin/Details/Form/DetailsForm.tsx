import React, { useCallback, useEffect } from "react";
import { Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";

import { DEFAULT_VENUE_BANNER, DEFAULT_VENUE_LOGO } from "settings";

import { createUrlSafeName, createWorld, updateVenue_v2 } from "api/admin";

import { VenueTemplate } from "types/venues";

import { adminNGRootUrl, adminNGVenueUrl, venueLandingUrl } from "utils/url";
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

import * as S from "./DetailsForm.styles";
import { DetailsFormProps, FormValues } from "./DetailsForm.types";

import "./DetailsForm.scss";

const DetailsForm: React.FC<DetailsFormProps> = ({ dispatch, editData }) => {
  const history = useHistory();
  const venueId = useVenueId();
  const { user } = useUser();

  const setWorld = useCallback(
    async (vals: FormValues) => {
      if (!user) return;

      const world = { ...vals, id: createUrlSafeName(vals.name) };

      try {
        if (venueId) {
          await updateVenue_v2(world, user);
          history.push(adminNGRootUrl());
        } else {
          await createWorld(world, user);
          history.push(adminNGVenueUrl(world.id));
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
    triggerValidation,
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
        { bannerImageUrl: editData?.bannerImageUrl ?? DEFAULT_VENUE_BANNER },
        { logoImageUrl: editData?.logoImageUrl ?? DEFAULT_VENUE_LOGO },
        { showGrid: editData?.showGrid },
      ]);
    }
  }, [editData, setValue, venueId]);

  const handleBannerUpload = (url: string) => {
    setBannerURL(dispatch, url);
    void triggerValidation();
  };

  const handleLogoUpload = (url: string) => {
    setSquareLogoUrl(dispatch, url);
    void triggerValidation();
  };

  const renderVenueName = () => (
    <S.InputContainer hasError={!!errors?.name}>
      <h4 className="italic" style={{ fontSize: "20px" }}>
        Name your space
      </h4>
      <input
        disabled={disable || !!venueId}
        name="name"
        ref={register}
        className="align-left"
        placeholder="My Space Name"
        style={{ cursor: nameDisabled ? "disabled" : "text" }}
      />
      {errors.name ? (
        <span className="input-error">{errors.name.message}</span>
      ) : urlSafeName ? (
        <S.InputInfo>
          The URL of your space will be: <b>{urlSafeName}</b>
        </S.InputInfo>
      ) : null}
    </S.InputContainer>
  );

  const renderSubtitle = () => (
    <S.InputContainer hasError={!!errors?.subtitle}>
      <h4 className="italic" style={{ fontSize: "20px" }}>
        Space subtitle
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
    </S.InputContainer>
  );

  const renderDescription = () => (
    <S.InputContainer hasError={!!errors?.description}>
      <h4 className="italic" style={{ fontSize: "20px" }}>
        Space description
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
    </S.InputContainer>
  );

  const renderBannerUpload = () => (
    <S.InputContainer>
      <h4 className="italic" style={{ fontSize: "20px" }}>
        Upload a banner photo
      </h4>
      <ImageInput
        onChange={handleBannerUpload}
        name="bannerImage"
        error={errors.bannerImageFile || errors.bannerImageUrl}
        setValue={setValue}
        register={register}
        imgUrl={editData?.bannerImageUrl}
      />
    </S.InputContainer>
  );

  const renderLogoUpload = () => (
    <S.InputContainer>
      <h4 className="italic" style={{ fontSize: "20px" }}>
        Upload your logo
      </h4>
      <ImageInput
        onChange={handleLogoUpload}
        name="logoImage"
        small
        error={errors.logoImageFile || errors.logoImageUrl}
        setValue={setValue}
        register={register}
        imgUrl={editData?.logoImageUrl}
      />
    </S.InputContainer>
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
      onSubmit={handleSubmit(setWorld)}
      onChange={handleOnChange}
    >
      <S.FormInnerWrapper>
        <input
          type="hidden"
          name="template"
          value={templateID}
          ref={register}
        />
        <h4 className="italic" style={{ fontSize: "30px" }}>
          {venueId ? "Edit your space" : "Create your space"}
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
        {renderBannerUpload()}
        {renderLogoUpload()}
      </S.FormInnerWrapper>

      <S.FormFooter>
        <ButtonNG
          variant="primary"
          disabled={isSubmitting || !dirty}
          type="submit"
          loading={isSubmitting}
        >
          {venueId ? "Update Space" : "Create Space"}
        </ButtonNG>
      </S.FormFooter>
    </Form>
  );
};

export default DetailsForm;
