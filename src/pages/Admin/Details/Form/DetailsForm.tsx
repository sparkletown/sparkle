import React, { useCallback, useEffect } from "react";

// API
import {
  createUrlSafeName,
  createVenue_v2,
  VenueInput_v2,
  updateVenue_v2,
} from "api/admin";

// Components
import ImageInput from "components/atoms/ImageInput";

// Hooks
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useUser } from "hooks/useUser";

// Utils | Settings | Constants | Helpers
import { venueLandingUrl } from "utils/url";
import { createJazzbar } from "utils/venue";

// Typings
import { VenueTemplate } from "types/venues";
import { DetailsFormProps } from "./DetailsForm.types";
import {
  setBannerURL,
  setSquareLogoUrl,
} from "pages/Admin/Venue/VenueWizard/redux/actions";

import { FormValues } from "./DetailsForm.types";

// Validation schemas
import { validationSchema_v2 } from "../ValidationSchema";

// Reducer
import { SET_FORM_VALUES } from "pages/Admin/Venue/VenueWizard/redux/actionTypes";

// Stylings
import * as S from "./DetailsForm.styles";
import { Button, Form } from "react-bootstrap";
import { useVenueId } from "hooks/useVenueId";

const DetailsForm: React.FC<DetailsFormProps> = ({
  dispatch,
  editData,
  onSave,
}) => {
  const history = useHistory();
  const venueId = useVenueId();
  const { user } = useUser();

  const onSubmit = useCallback(
    async (vals: FormValues) => {
      if (!user) return;

      try {
        // unfortunately the typing is off for react-hook-forms.
        if (!!venueId) await updateVenue_v2(vals as VenueInput_v2, user);
        else await createVenue_v2(vals as VenueInput_v2, user);

        onSave && onSave();
        history.push(`/admin_v2/venue/${createUrlSafeName(vals.name!)}`);
      } catch (e) {
        console.error(e);
      }
    },
    [history, onSave, user, venueId]
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

  const urlSafeName = `${window.location.host}${venueLandingUrl(
    createUrlSafeName(values?.name ?? "")
  )}`;

  const disable = isSubmitting;
  const templateID = VenueTemplate.partymap;

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
    <S.InputContainer hasError={!!errors?.name}>
      <div>Name</div>
      <input
        disabled={disable || !!venueId}
        name="name"
        ref={register}
        className="align-left"
        placeholder="Sparkle space name"
      />
      {errors.name ? (
        <div className="input-error">{errors.name.message}</div>
      ) : urlSafeName ? (
        <S.InputInfo>
          The url of your space will be: <b>{urlSafeName}</b>
        </S.InputInfo>
      ) : null}
    </S.InputContainer>
  );

  const renderSubtitle = () => (
    <S.InputContainer hasError={!!errors?.subtitle}>
      <div>Subtitle</div>
      <input
        disabled={disable}
        name={"subtitle"}
        ref={register}
        className="wide-input-block align-left"
        placeholder={defaultVenue.config?.landingPageConfig.subtitle}
      />
      {errors.subtitle && (
        <div className="input-error">{errors.subtitle.message}</div>
      )}
    </S.InputContainer>
  );

  const renderDescription = () => (
    <S.InputContainer hasError={!!errors?.description}>
      <div>Party description</div>
      <textarea
        disabled={disable}
        name={"description"}
        ref={register}
        className="wide-input-block align-left"
        placeholder={defaultVenue.config?.landingPageConfig.description}
      />
      {errors.description && (
        <span className="input-error">{errors.description.message}</span>
      )}
    </S.InputContainer>
  );

  const renderBannerUpload = () => (
    <ImageInput
      onChange={handleBannerUpload}
      title="Upload a banner photo"
      name="bannerImage"
      error={errors.bannerImageFile || errors.bannerImageUrl}
      forwardRef={register}
      imgUrl={editData?.bannerImageUrl}
    />
  );

  const renderLogoUpload = () => (
    <ImageInput
      onChange={handleLogoUpload}
      title="Upload a logo"
      name="logoImage"
      small
      error={errors.logoImageFile || errors.logoImageUrl}
      forwardRef={register}
      imgUrl={editData?.logoImageUrl}
    />
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
    <Form onSubmit={handleSubmit(onSubmit)} onChange={handleOnChange}>
      <S.FormInnerWrapper>
        <input
          type="hidden"
          name="template"
          value={templateID}
          ref={register}
        />
        <h4 style={{ fontSize: "30px" }}>
          {venueId ? "Edit your Sparkle Space" : "Create your Sparkle Space"}
        </h4>
        <p
          className="small light"
          style={{ marginBottom: "2rem", fontSize: "16px" }}
        >
          You can change everything but the name later
        </p>

        {renderVenueName()}
        {renderSubtitle()}
        {renderDescription()}
        {renderBannerUpload()}
        {renderLogoUpload()}
      </S.FormInnerWrapper>

      <S.FormFooter>
        <Button disabled={isSubmitting || !dirty} type="submit">
          {!!venueId ? "Update Venue" : "Create Venue"}
        </Button>
      </S.FormFooter>
    </Form>
  );
};

export default DetailsForm;
