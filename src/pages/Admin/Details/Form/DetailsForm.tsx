import React, { useCallback, useEffect, useMemo } from "react";
import { Dropdown as ReactBootstrapDropdown, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import classNames from "classnames";

import { DEFAULT_VENUE_LOGO } from "settings";

import { createUrlSafeName, createVenue_v2, updateVenue_v2 } from "api/admin";

import { VenueTemplate } from "types/venues";

import { adminWorldSpacesUrl, venueLandingUrl } from "utils/url";
import { createJazzbar } from "utils/venue";

import { useUser } from "hooks/useUser";
import { useVenueId } from "hooks/useVenueId";
import { useWorldEditParams } from "hooks/useWorldEditParams";
import { useWorldVenues } from "hooks/worlds/useWorldVenues";

import { ButtonNG } from "components/atoms/ButtonNG";
import { Dropdown } from "components/atoms/Dropdown";
import ImageInput from "components/atoms/ImageInput";

import { validationSchema_v2 } from "../ValidationSchema";

import { DetailsFormProps, FormValues } from "./DetailsForm.types";

import "./DetailsForm.scss";

const DetailsForm: React.FC<DetailsFormProps> = ({ venue }) => {
  const history = useHistory();
  const venueId = useVenueId();
  const { user } = useUser();

  const { worldId } = useWorldEditParams();

  const setVenue = useCallback(
    async (vals: FormValues) => {
      if (!user) return;

      try {
        if (venueId) {
          const updatedVenue = {
            ...vals,
            id: venueId,
            worldId: venue?.worldId ?? "",
          };

          await updateVenue_v2(updatedVenue, user);

          history.push(adminWorldSpacesUrl(venue?.worldId));
        } else {
          const newVenue = {
            ...vals,
            id: createUrlSafeName(vals.name),
            worldId: worldId ?? "",
          };

          await createVenue_v2(newVenue, user);

          history.push(adminWorldSpacesUrl(worldId));
        }
      } catch (e) {
        console.error(e);
      }
    },
    [history, user, venue?.worldId, venueId, worldId]
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
    if (venue && venueId) {
      setValue([
        { name: venue?.name },
        { subtitle: venue?.config?.landingPageConfig.subtitle },
        { description: venue?.config?.landingPageConfig?.description },
        {
          bannerImageUrl: venue?.config?.landingPageConfig?.coverImageUrl ?? "",
        },
        { logoImageUrl: venue?.host?.icon ?? DEFAULT_VENUE_LOGO },
        { showGrid: venue?.showGrid },
      ]);
    }
  }, [venue, setValue, venueId]);

  const handleBannerUpload = (url: string) => {
    setValue("bannerImage", url);
    void triggerValidation();
  };

  const handleLogoUpload = (url: string) => {
    setValue("logoImage", url);
    void triggerValidation();
  };

  const renderVenueName = () => (
    <div className="DetailsForm__input-container">
      <h4 className="italic">Name your space</h4>
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
        imgUrl={venue?.config?.landingPageConfig.coverImageUrl}
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
        imgUrl={venue?.host?.icon}
      />
    </div>
  );

  const { worldVenuesIds } = useWorldVenues(worldId ?? "");

  const parentIdDropdownOptions = useMemo(
    () =>
      worldVenuesIds.map((venueId) => (
        <ReactBootstrapDropdown.Item
          key={venueId}
          onClick={() => setValue("parentId", venueId)}
        >
          {venueId}
        </ReactBootstrapDropdown.Item>
      )),
    [setValue, worldVenuesIds]
  );

  const renderedParentIdDropdown = useMemo(
    () => (
      <div>
        <h4 className="italic">Upload your logo</h4>
        <Dropdown title="Parent id" options={parentIdDropdownOptions} />
      </div>
    ),
    [parentIdDropdownOptions]
  );

  const formStyles = classNames({ DetailsForm__edit: venueId });

  return (
    <Form className={formStyles} onSubmit={handleSubmit(setVenue)}>
      <div className="DetailsForm__wrapper">
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
        {renderHighlightImageUpload()}
        {renderLogoUpload()}
        {renderedParentIdDropdown}
      </div>

      <div className="DetailsForm__footer">
        <ButtonNG
          variant="primary"
          disabled={isSubmitting || !dirty}
          type="submit"
          loading={isSubmitting}
        >
          {venueId ? "Update Space" : "Create Space"}
        </ButtonNG>
      </div>
    </Form>
  );
};

export default DetailsForm;
