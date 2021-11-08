import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { useAsyncFn } from "react-use";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";

import {
  ALWAYS_EMPTY_ARRAY,
  DEFAULT_USER_STATUS,
  DEFAULT_VENUE_LOGO,
} from "settings";

import { createSlug, createVenue_v2, updateVenue_v2 } from "api/admin";

import { UserStatus } from "types/User";
import { VenueTemplate } from "types/venues";

import { adminWorldSpacesUrl } from "utils/url";

import { useOwnedVenues } from "hooks/useConnectOwnedVenues";
import { useUser } from "hooks/useUser";
import { useVenueId } from "hooks/useVenueId";
import { useWorldEditParams } from "hooks/useWorldEditParams";
import { useWorldVenues } from "hooks/worlds/useWorldVenues";

import { AdminSidebarFooter } from "components/organisms/AdminVenueView/components/AdminSidebarFooter";
import { AdminSpacesListItem } from "components/organisms/AdminVenueView/components/AdminSpacesListItem";

import { AdminCheckbox } from "components/molecules/AdminCheckbox";
import { AdminInput } from "components/molecules/AdminInput";
import { AdminSection } from "components/molecules/AdminSection";
import { AdminTextarea } from "components/molecules/AdminTextarea";
import { FormErrors } from "components/molecules/FormErrors";
import { SubmitError } from "components/molecules/SubmitError";
import { UserStatusPanel } from "components/molecules/UserStatusManager/components/UserStatusPanel";

import { ButtonNG, ButtonProps } from "components/atoms/ButtonNG";
import ImageInput from "components/atoms/ImageInput";
import { PortalVisibility } from "components/atoms/PortalVisibility";
import { SpacesDropdown } from "components/atoms/SpacesDropdown";

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

  const { worldParentVenues } = useWorldVenues(worldId ?? venue?.worldId ?? "");

  const { subtitle, description, coverImageUrl } =
    venue?.config?.landingPageConfig ?? {};
  const { icon } = venue?.host ?? {};
  const {
    name,
    showGrid,
    parentId,
    showBadges,
    radioStations,
    requiresDateOfBirth,
    showUserStatus,
    hasSocialLoginEnabled,
    enableJukebox,
    showRadio,
    roomVisibility,
  } = venue ?? {};

  const defaultValues = useMemo(
    () => ({
      name: name ?? "",
      bannerImageFile: undefined,
      logoImageFile: undefined,
      bannerImageUrl: coverImageUrl ?? "",
      logoImageUrl: icon ?? "",
      description: description ?? "",
      subtitle: subtitle ?? "",
      showGrid: showGrid ?? false,
      columns: 0,
      worldId: worldId ?? "",
      parentId: parentId ?? "",
      showBadges: showBadges,
      radioStations: radioStations ? radioStations[0] : "",
      requiresDateOfBirth: requiresDateOfBirth,
      showUserStatus: showUserStatus,
      userStatuses: venue?.userStatuses,
      hasSocialLoginEnabled: hasSocialLoginEnabled,
      enableJukebox: enableJukebox,
      showRadio: showRadio,
      roomVisibility: roomVisibility ?? "",
    }),
    [
      name,
      showGrid,
      parentId,
      worldId,
      icon,
      description,
      subtitle,
      coverImageUrl,
      showBadges,
      radioStations,
      requiresDateOfBirth,
      showUserStatus,
      venue?.userStatuses,
      hasSocialLoginEnabled,
      enableJukebox,
      showRadio,
      roomVisibility,
    ]
  );

  const {
    watch,
    formState: { isSubmitting, dirty },
    register,
    setValue,
    setError,
    errors,
    handleSubmit,
    triggerValidation,
    getValues,
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    validationSchema: validationSchema_v2,
    validationContext: {
      editing: !!venueId,
    },
    defaultValues,
  });
  console.log(defaultValues);
  const values = watch();
  console.log(values);
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
      console.log("submit val", vals);
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

  // @debt Should this be hardcoded here like this? At the very least maybe it should reference a constant/be defined outside of this component render
  const templateID = VenueTemplate.partymap;
  const nameDisabled = isSubmitting || !!venueId;

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
    setValue("bannerImageUrl", url);
    void triggerValidation();
  };

  const handleLogoUpload = (url: string) => {
    setValue("logoImageUrl", url);
    void triggerValidation();
  };

  const navigateToHome = useCallback(() => {
    history.push(
      adminWorldSpacesUrl(worldId ?? values?.worldId ?? venue?.worldId)
    );
  }, [history, worldId, values?.worldId, venue?.worldId]);

  const saveButtonProps: ButtonProps = useMemo(
    () => ({
      type: "submit",
      variant: "primary",
      disabled: isSubmitting || isSaving || !dirty,
      loading: isSubmitting || isSaving,
    }),
    [dirty, isSaving, isSubmitting]
  );

  const { ownedVenues } = useOwnedVenues({});

  const venueSpaces = ownedVenues.map(({ name, template }) => ({
    name,
    template,
  }));

  const [userStatuses, setUserStatuses] = useState<UserStatus[]>(
    values.userStatuses ?? []
  );

  const addUserStatus = useCallback(
    () =>
      setUserStatuses([
        ...userStatuses,
        { status: "", color: DEFAULT_USER_STATUS.color },
      ]),
    [userStatuses, setUserStatuses]
  );

  const deleteStatus = useCallback(
    (index: number) => {
      const statuses = [...userStatuses];
      statuses.splice(index, 1);
      setUserStatuses(statuses);
    },
    [userStatuses, setUserStatuses]
  );

  const changeInput = useCallback(
    (event: React.FormEvent<HTMLInputElement>, index: number) => {
      const statuses = [...userStatuses];

      statuses[index] = {
        color: statuses[index].color,
        status: event.currentTarget.value,
      };
      setUserStatuses(statuses);
    },
    [userStatuses, setUserStatuses]
  );

  const pickColor = useCallback(
    (color: string, index: number) => {
      const statuses = [...userStatuses];
      statuses[index] = { color, status: statuses[index].status };
      setUserStatuses(statuses);
    },
    [userStatuses, setUserStatuses]
  );

  const renderVenueUserStatuses = useMemo(
    () =>
      userStatuses.map((userStatus, index) => (
        <UserStatusPanel
          key={`${userStatus}-${index}`}
          userStatus={userStatus}
          onPickColor={(color) => pickColor(color, index)}
          onChangeInput={(value) => changeInput(value, index)}
          onDelete={() => deleteStatus(index)}
        />
      )),
    [changeInput, deleteStatus, pickColor, userStatuses]
  );

  const jukeboxToggleClasses = classNames({
    "mod--hidden": venue?.template !== VenueTemplate.jazzbar,
  });

  return (
    <Form className="DetailsForm" onSubmit={handleSubmit(setVenue)}>
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
      </div>
      <AdminSpacesListItem title="The basics" isOpened>
        <>
          <AdminSection title="Rename your space" withLabel>
            <AdminInput
              name="name"
              placeholder="Space Name"
              register={register}
              errors={errors}
              required
              disabled={nameDisabled}
            />
          </AdminSection>
          <AdminSection title="Subtitle" withLabel>
            <AdminInput
              name="subtitle"
              placeholder="Subtitle for your space"
              register={register}
              errors={errors}
            />
          </AdminSection>
          <AdminSection title="Description" withLabel>
            <AdminTextarea
              name="description"
              placeholder={`Let your guests know what they’ll find when they join your space. Keep it short & sweet, around 2-3 sentences maximum. Be sure to indicate any expectations for their participation.`}
              register={register}
              errors={errors}
            />
          </AdminSection>
          <AdminSection
            title="Select the parent space for the “back” button"
            withLabel
          >
            <SpacesDropdown
              venueSpaces={venueSpaces ?? ALWAYS_EMPTY_ARRAY}
              venueId={venueId}
              setValue={setValue}
              register={register}
              fieldName="parentId"
              defaultSpace={values.parentId}
            />
          </AdminSection>
          <AdminCheckbox
            name="showBadges"
            label="Show Badges"
            variant="toggler"
            register={register}
          />
          <AdminCheckbox
            name="requiresDateOfBirth"
            label="Require Date of Birth"
            variant="toggler"
            register={register}
          />

          <AdminCheckbox
            name="showRadio"
            label="Enable Space Radio"
            variant="toggler"
            register={register}
          />
          <Form.Label>Radio station stream URL: </Form.Label>
          <AdminInput
            name="radioStations"
            placeholder="Radio station stream URL:"
            register={register}
            errors={errors}
            required={values.showRadio}
            disabled={!values.showRadio}
          />
          <AdminSection title="Enable Social Login">
            <AdminCheckbox
              name="hasSocialLoginEnabled"
              label="Users can login using Google/Facebook/Okta social networks"
              variant="toggler"
              register={register}
            />
          </AdminSection>

          <div className={jukeboxToggleClasses}>
            <AdminCheckbox
              variant="toggler"
              register={register}
              name="enableJukebox"
              title="Enable Jukebox"
            />
          </div>

          <AdminCheckbox
            register={register}
            name="showUserStatus"
            label="Show user status"
            variant="toggler"
          />

          {values.showUserStatus && (
            <>
              {renderVenueUserStatuses}
              <ButtonNG
                variant="primary"
                iconName={faPlus}
                onClick={addUserStatus}
              >
                Add a status
              </ButtonNG>
            </>
          )}
        </>
      </AdminSpacesListItem>
      <AdminSpacesListItem title="Appearance" isOpened>
        <AdminSection title="Default portal appearance">
          <PortalVisibility
            getValues={getValues}
            name="roomVisibility"
            register={register}
            setValue={setValue}
          />
        </AdminSection>
        <AdminSection title="Upload a highlight image">
          <ImageInput
            onChange={handleBannerUpload}
            name="bannerImage"
            imgUrl={values.bannerImageUrl}
            error={errors.bannerImageUrl}
            isInputHidden={!values.bannerImageUrl}
            register={register}
            setValue={setValue}
          />
        </AdminSection>
        <AdminSection title="Upload a logo">
          <ImageInput
            onChange={handleLogoUpload}
            name="logoImage"
            imgUrl={values.logoImageUrl}
            error={errors.logoImageUrl}
            setValue={setValue}
            register={register}
            small
          />
        </AdminSection>
      </AdminSpacesListItem>
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
