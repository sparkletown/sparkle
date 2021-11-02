import React, { useCallback, useEffect, useMemo } from "react";
import { Dropdown as ReactBootstrapDropdown, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { useAsyncFn } from "react-use";

import { DEFAULT_VENUE_LOGO } from "settings";

import { createSlug, createVenue_v2, updateVenue_v2 } from "api/admin";

import { VenueTemplate } from "types/venues";

import { adminWorldSpacesUrl, venueLandingUrl } from "utils/url";
import { createJazzbar } from "utils/venue";

import { useUser } from "hooks/useUser";
import { useVenueId } from "hooks/useVenueId";
import { useWorldEditParams } from "hooks/useWorldEditParams";
import { useWorldVenues } from "hooks/worlds/useWorldVenues";

import { AdminSidebarFooter } from "components/organisms/AdminVenueView/components/AdminSidebarFooter";

import { FormErrors } from "components/molecules/FormErrors";
import { SubmitError } from "components/molecules/SubmitError";

import { ButtonProps } from "components/atoms/ButtonNG/ButtonNG";
import { Dropdown } from "components/atoms/Dropdown";
import ImageInput from "components/atoms/ImageInput";

import { validationSchema_v2 } from "../ValidationSchema";

import { DetailsFormProps, FormValues } from "./DetailsForm.types";

import "./DetailsForm.scss";

// NOTE: add the keys of those errors that their respective fields have handled
const HANDLED_ERRORS: string[] = [
  "name",
  "subtitle",
  "description",
  "bannerImageFile",
  "bannerImageUrl",
  "logoImageFile",
  "logoImageUrl",
  "parentId",
];

const DetailsForm: React.FC<DetailsFormProps> = ({ venue }) => {
  const history = useHistory();
  const venueId = useVenueId();
  const { user } = useUser();

  const { worldId } = useWorldEditParams();

  const { worldVenuesIds, worldParentVenues } = useWorldVenues(
    worldId ?? venue?.worldId ?? ""
  );

  const { subtitle, description, coverImageUrl } =
    venue?.config?.landingPageConfig ?? {};
  const { icon } = venue?.host ?? {};
  const { name, showGrid, parentId } = venue ?? {};

  const {
    watch,
    formState: { isSubmitting, dirty },
    register,
    setValue,
    setError,
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

  const validateParentId = useCallback(
    (parentId, checkedIds) => {
      if (checkedIds.includes(parentId)) return false;

      if (!parentId) return true;

      const parentVenue = worldParentVenues.find(
        (venue) => venue.id === parentId
      );

      if (!parentVenue) return true;

      validateParentId(parentVenue?.parentId, [...checkedIds, parentId]);
    },
    [worldParentVenues]
  );

  const [{ error: submitError, loading: isSaving }, setVenue] = useAsyncFn(
    async (vals: FormValues) => {
      if (!user) return;

      const isValidParentId = validateParentId(values.parentId, [
        venueId ?? createSlug(vals.name),
      ]);

      if (!isValidParentId) {
        setError(
          "parentId",
          "manual",
          "This parent id is invalid because it will create a loop of parent venues. If venue 'A' is a parent of venue 'B', venue 'B' can't be a parent of venue 'A'."
        );
        return;
      }

      if (venueId) {
        const updatedVenue = {
          ...vals,
          id: venueId,
          worldId: venue?.worldId ?? "",
          parentId: values.parentId,
        };

        await updateVenue_v2(updatedVenue, user);

        history.push(adminWorldSpacesUrl(venue?.worldId));
      } else {
        const newVenue = {
          ...vals,
          id: createSlug(vals.name),
          worldId: worldId ?? "",
          parentId: values.parentId ?? "",
        };

        await createVenue_v2(newVenue, user);

        history.push(adminWorldSpacesUrl(worldId));
      }
    },
    [
      history,
      setError,
      user,
      validateParentId,
      values.parentId,
      venue?.worldId,
      venueId,
      worldId,
    ]
  );

  const urlSafeName = values.name
    ? `${window.location.host}${venueLandingUrl(createSlug(values.name))}`
    : undefined;
  const disable = isSubmitting;

  // @debt Should this be hardcoded here like this? At the very least maybe it should reference a constant/be defined outside of this component render
  const templateID = VenueTemplate.partymap;
  const nameDisabled = isSubmitting || !!venueId;

  const defaultVenue = createJazzbar({});

  useEffect(() => {
    if (venue && venueId) {
      setValue([
        { name: name },
        { subtitle },
        { description },
        {
          bannerImageUrl: coverImageUrl ?? "",
        },
        { logoImageUrl: icon ?? DEFAULT_VENUE_LOGO },
        { showGrid: showGrid },
        { parentId: parentId },
      ]);
    }
  }, [
    coverImageUrl,
    description,
    icon,
    name,
    parentId,
    setValue,
    showGrid,
    subtitle,
    venue,
    venueId,
  ]);

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

  const parentIdDropdownOptions = useMemo(
    () =>
      ["", ...worldVenuesIds].map((venueId) => (
        <ReactBootstrapDropdown.Item
          key={venueId}
          onClick={() => setValue("parentId", venueId)}
        >
          {venueId ? venueId : "None"}
        </ReactBootstrapDropdown.Item>
      )),
    [setValue, worldVenuesIds]
  );

  const renderedParentIdDropdown = useMemo(
    () => (
      <>
        <h4 className="italic">Select a parent for your venue</h4>
        <Dropdown
          title={values.parentId ? values.parentId : "None"}
          options={parentIdDropdownOptions}
        />
        <input
          type="hidden"
          ref={register}
          defaultValue={values.parentId ?? ""}
          name={"parentId"}
        />
        {errors.parentId && (
          <span className="input-error">{errors.parentId.message}</span>
        )}
      </>
    ),
    [errors.parentId, parentIdDropdownOptions, register, values.parentId]
  );

  const navigateToHome = useCallback(() => {
    history.push(adminWorldSpacesUrl(worldId ?? values?.worldId));
  }, [values?.worldId, history, worldId]);

  const saveButtonProps: ButtonProps = useMemo(
    () => ({
      type: "submit",
      variant: "primary",
      disabled: isSubmitting || isSaving || !dirty,
      loading: isSubmitting || isSaving,
    }),
    [dirty, isSaving, isSubmitting]
  );

  return (
    <Form onSubmit={handleSubmit(setVenue)} className="DetailsForm">
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
      <FormErrors errors={errors} omitted={HANDLED_ERRORS} />
      <SubmitError error={submitError} />

      <AdminSidebarFooter
        onClickHome={navigateToHome}
        saveButtonProps={saveButtonProps}
        saveButtonText={venueId ? "Update Space" : "Create Space"}
      />
    </Form>
  );
};

export default DetailsForm;
