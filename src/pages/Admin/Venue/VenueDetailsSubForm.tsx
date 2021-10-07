import React, { useCallback, useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { FieldErrors, useForm } from "react-hook-form";
import classNames from "classnames";

import {
  BACKGROUND_IMG_TEMPLATES,
  DEFAULT_EMBED_URL,
  DEFAULT_SHOW_SCHEDULE,
  DEFAULT_SHOW_USER_STATUSES,
  DEFAULT_USER_STATUS,
  DEFAULT_VENUE_AUTOPLAY,
  HAS_GRID_TEMPLATES,
  HAS_REACTIONS_TEMPLATES,
  HAS_ROOMS_TEMPLATES,
  IFRAME_TEMPLATES,
  ROOMS_TAXON,
  SECTION_DEFAULT_COLUMNS_COUNT,
  SECTION_DEFAULT_ROWS_COUNT,
  ZOOM_ROOM_TAXON,
  ZOOM_URL_TEMPLATES,
} from "settings";

import { createUrlSafeName } from "api/admin";

import { UserStatus } from "types/User";
import { AnyVenue, VenueTemplate } from "types/venues";

import { venueLandingUrl } from "utils/url";
import { createJazzbar } from "utils/venue";

import { useShowHide } from "hooks/useShowHide";

import { FormValues } from "pages/Admin/Venue/VenueDetailsForm";
import { VenueDetailsFormErrors } from "pages/Admin/Venue/VenueDetailsFormErrors";
import { WizardPage } from "pages/Admin/Venue/VenueWizard";

import { ImageInput } from "components/molecules/ImageInput";
import { ImageCollectionInput } from "components/molecules/ImageInput/ImageCollectionInput";
import { UserStatusManager } from "components/molecules/UserStatusManager";

import { Toggler } from "components/atoms/Toggler";

import "firebase/functions";

import EntranceInput from "./EntranceInput";
import QuestionInput from "./QuestionInput";

// @debt refactor any needed styles out of this file (eg. toggles, etc) and into DetailsForm.scss/similar, then remove this import
import "../Admin.scss";
import "./Venue.scss";

// @debt Refactor this constant into settings, or types/templates, or similar?
// @debt remove reference to legacy 'Theme Camp' here, both should probably just
//  display the same text as themecamp is now essentially just an alias of partymap
const backgroundTextByVenue: Record<string, string> = {
  [VenueTemplate.themecamp]: "Theme Camp",
  [VenueTemplate.partymap]: "Party Map",
};

interface VenueDetailsSubFormProps
  extends Pick<
    ReturnType<typeof useForm>,
    "register" | "watch" | "control" | "handleSubmit" | "setError" | "setValue"
  > {
  venueId?: string;
  sovereignVenue?: AnyVenue;
  state: WizardPage["state"];
  previous: WizardPage["previous"];
  isSubmitting: boolean;
  onSubmit: (
    vals: Partial<FormValues>,
    userStatuses: UserStatus[],
    showUserStatuses: boolean
  ) => Promise<void>;
  errors: FieldErrors<FormValues>;
  editing?: boolean;
  formError: boolean;
  setFormError: (value: boolean) => void;
}

export const VenueDetailsSubForm: React.FC<VenueDetailsSubFormProps> = ({
  venueId,
  sovereignVenue,
  editing,
  state,
  isSubmitting,
  register,
  watch,
  errors,
  setError,
  previous,
  onSubmit,
  handleSubmit,
  setValue,
  formError,
  setFormError,
}) => {
  const values = watch();
  const urlSafeName = values.name
    ? `${window.location.host}${venueLandingUrl(
        createUrlSafeName(values.name)
      )}`
    : undefined;
  const disable = isSubmitting;
  const templateType = state.templatePage?.template.name;
  const templateID = state.templatePage?.template.template;

  const defaultVenue = createJazzbar({});

  const renderVenueNameInput = () => {
    return !editing ? (
      <div className="input-container">
        <h4 className="italic input-header">Name your {templateType}</h4>
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
        <h4 className="italic input-header">
          Your {templateType}: {values.name}
        </h4>
        <input type="hidden" name="name" ref={register} value={values.name} />
        <span className="input-info">
          The URL of your venue will be: <b>{urlSafeName}</b>
        </span>
      </div>
    );
  };

  const renderTaglineInput = () => (
    <div className="input-container">
      <h4 className="italic input-header">The venue tagline</h4>
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

  const renderDescriptionInput = () => (
    <div className="input-container">
      <h4 className="italic input-header">Long description</h4>
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

  const renderRestrictToAdultsInput = () => (
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

  const renderHighlightImageInput = () => (
    <div className="input-container">
      <h4 className="italic input-header">Upload Highlight image</h4>
      <ImageInput
        disabled={disable}
        name={"bannerImageFile"}
        image={values.bannerImageFile}
        remoteUrlInputName={"bannerImageUrl"}
        remoteImageUrl={values.bannerImageUrl}
        register={register}
        setValue={setValue}
        error={errors.bannerImageFile || errors.bannerImageUrl}
        isInputHidden={!values.bannerImageUrl}
        text="Upload Highlight image"
      />
    </div>
  );

  const renderLogoInput = () => (
    <div className="input-container">
      <h4 className="italic input-header">Upload a logo</h4>
      <ImageInput
        disabled={disable}
        register={register}
        setValue={setValue}
        image={values.logoImageFile}
        remoteUrlInputName={"logoImageUrl"}
        remoteImageUrl={values.logoImageUrl}
        name={"logoImageFile"}
        containerClassName="host-icon-container"
        imageClassName="host-icon"
        error={errors.logoImageFile || errors.logoImageUrl}
      />
    </div>
  );

  const renderAttendeesTitleInput = () => (
    <div className="input-container">
      <h4 className="italic input-header">Title of your venues attendees</h4>
      <div style={{ fontSize: "16px" }}>
        For example: guests, attendees, partygoers.
      </div>
      <input
        type="text"
        disabled={disable}
        name="attendeesTitle"
        ref={register}
        className="wide-input-block input-centered align-left"
        placeholder="Attendees title"
      />
      {errors.attendeesTitle && (
        <span className="input-error">{errors.attendeesTitle.message}</span>
      )}
    </div>
  );

  const renderChatTitleInput = () => (
    <div className="input-container">
      <h4 className="italic input-header">Your venue type label</h4>
      <div style={{ fontSize: "16px" }}>For example: Party, Event, Meeting</div>
      <input
        type="text"
        disabled={disable}
        name="chatTitle"
        ref={register}
        className="wide-input-block input-centered align-left"
        placeholder="Event label"
      />
      {errors.chatTitle && (
        <span className="input-error">{errors.chatTitle.message}</span>
      )}
    </div>
  );

  const renderUrlInput = () => (
    <div className="input-container">
      <h4 className="italic input-header">URL</h4>
      <div style={{ fontSize: "16px" }}>
        Please post a URL to, for example, a {ZOOM_ROOM_TAXON.capital}, Twitch
        stream, other Universe, or any interesting thing out there on the open
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
  );

  const renderLivestreamUrlInput = () => (
    <div className="input-container">
      <div className="input-title">
        Livestream URL, or embed URL, for people to view in your venue
      </div>
      <div className="input-title">
        (Enter an embeddable URL link. For now there is a placeholder video, so
        you can edit this later.)
      </div>

      {/* note: the default embedded video is the "Intro to Sparkle" video*/}
      <textarea
        placeholder={DEFAULT_EMBED_URL}
        disabled={disable}
        name={"iframeUrl"}
        ref={register}
        className="wide-input-block input-centered align-left"
      ></textarea>
      {errors.iframeUrl && (
        <span className="input-error">{errors.iframeUrl.message}</span>
      )}
      <h4 className="italic input-header">Autoplay your embeded video</h4>
      <Toggler
        name="autoPlay"
        forwardedRef={register}
        defaultToggled={DEFAULT_VENUE_AUTOPLAY}
      />
    </div>
  );

  // @debt pass the header into Toggler's 'label' prop instead of being external like this
  const renderShowScheduleToggle = () => (
    <div className="toggle-room">
      <h4 className="italic input-header">Show Schedule</h4>
      <Toggler
        name="showSchedule"
        forwardedRef={register}
        defaultToggled={DEFAULT_SHOW_SCHEDULE}
      />
    </div>
  );

  // @debt pass the header into Toggler's 'label' prop instead of being external like this
  const renderShowGridToggle = () => (
    <div className="toggle-room">
      <h4 className="italic input-header">Show grid layout</h4>
      <Toggler name="showGrid" forwardedRef={register} />
    </div>
  );

  // @debt pass the header into Toggler's 'label' prop instead of being external like this
  const renderShowBadgesToggle = () => (
    <div className="toggle-room">
      <h4 className="italic input-header">Show badges</h4>
      <Toggler name="showBadges" forwardedRef={register} />
    </div>
  );

  const renderSeatingNumberInput = () => (
    <>
      <div className="input-container">
        <h4 className="italic input-header">Number of seats columns</h4>
        <input
          disabled={disable}
          defaultValue={SECTION_DEFAULT_COLUMNS_COUNT}
          min={5}
          name="auditoriumColumns"
          type="number"
          ref={register}
          className="align-left"
          placeholder="Number of seats columns"
        />
        {errors.auditoriumColumns ? (
          <span className="input-error">
            {errors.auditoriumColumns.message}
          </span>
        ) : null}
      </div>
      <div className="input-container">
        <h4 className="italic input-header">Number of seats rows</h4>
        <input
          disabled={disable}
          defaultValue={SECTION_DEFAULT_ROWS_COUNT}
          name="auditoriumRows"
          type="number"
          ref={register}
          className="align-left"
          placeholder="Number of seats rows"
          min={5}
        />
        {errors.auditoriumRows ? (
          <span className="input-error">{errors.auditoriumRows.message}</span>
        ) : null}
      </div>
    </>
  );

  // @debt pass the header into Toggler's 'label' prop instead of being external like this
  const renderShowReactions = () => (
    <div className="toggle-room">
      <h4 className="italic input-header">Show reactions</h4>
      <Toggler name="showReactions" forwardedRef={register} />
    </div>
  );

  // @debt pass the header into Toggler's 'label' prop instead of being external like this
  const renderShowShoutouts = () => (
    <div className="toggle-room">
      <h4 className="italic input-header">Show shoutouts</h4>
      <Toggler name="showShoutouts" forwardedRef={register} />
    </div>
  );

  // @debt pass the header into Toggler's 'label' prop instead of being external like this
  const renderShowRangersToggle = () => (
    <div className="toggle-room">
      <h4 className="italic input-header">Show Rangers support</h4>
      <Toggler name="showRangers" forwardedRef={register} />
    </div>
  );

  // @debt pass the header into Toggler's 'label' prop instead of being external like this
  const renderRestrictDOBToggle = () => (
    <div className="toggle-room">
      <h4 className="italic input-header">Require date of birth on register</h4>
      <Toggler name="requiresDateOfBirth" forwardedRef={register} />
    </div>
  );

  const renderGridDimensionsInputs = () => (
    <>
      <div className="input-container">
        <h4 className="italic input-header">Number of columns</h4>
        <input
          disabled={disable}
          defaultValue={1}
          name="columns"
          type="number"
          ref={register}
          className="align-left"
          placeholder={`Number of grid columns`}
        />
        {errors.columns ? (
          <span className="input-error">{errors.columns.message}</span>
        ) : null}
      </div>
      <div className="input-container">
        <h4 className="italic input-header">Number of rows</h4>
        <div>
          Not editable. The number of rows is derived from the number of
          specified columns and the width:height ratio of the party map, to keep
          the two aligned.
        </div>
      </div>
    </>
  );

  const renderParentIdInput = () => (
    <div className="input-container">
      <h4 className="italic input-header">
        Enter the parent venue ID, for the &quot;back&quot; button to go to, and
        for sharing events in the schedule
      </h4>
      <div style={{ fontSize: "16px" }}>
        The nav bar can show a &quot;back&quot; button if you enter an ID here.
        Clicking &quot;back&quot; will return the user to the venue whose ID you
        enter. Additionally, the events you add here will be shown to users
        while they are on all other venues which share the parent venue ID you
        enter here, as well as in the parent venue. The value is a venue ID.
        Enter the venue ID you wish to use. A venue ID is the part of the URL
        after /in/, so eg. for <i>sparkle.space/in/abcdef</i> you would enter{" "}
        <i>abcdef</i>
        below
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

  const renderRoomAppearanceSelect = () => (
    <>
      <h4 className="italic input-header">
        Choose how you&apos;d like your {ROOMS_TAXON.lower} to appear on the map
      </h4>
      <div className="input-container">
        <Form.Control as="select" name="roomVisibility" ref={register} custom>
          <option value="hover">Hover</option>
          <option value="count">Count</option>
          <option value="count/name">Count and names</option>
        </Form.Control>
      </div>
    </>
  );

  const renderMapBackgroundInput = (templateID: string) => (
    <div className="input-container">
      <h4 className="italic input-header">
        {`Choose the background for your ${
          backgroundTextByVenue[templateID] ?? "Experience"
        }`}
      </h4>

      <ImageCollectionInput
        collectionPath={"assets/mapBackgrounds"}
        containerClassName="input-square-container"
        disabled={disable}
        error={errors.mapBackgroundImageFile || errors.mapBackgroundImageUrl}
        fieldName={"mapBackgroundImage"}
        image={values.mapBackgroundImageFile}
        imageClassName="input-square-image"
        imageType="backgrounds"
        imageUrl={values.mapBackgroundImageUrl}
        register={register}
        setValue={setValue}
      />
    </div>
  );

  const renderShowNametagsToggle = () => (
    <>
      <h4 className="italic input-header">
        Display user names on their avatars
      </h4>
      <label className="input-container">
        <Form.Control as="select" name="showNametags" ref={register} custom>
          <option value="none">None</option>
          {/* TODO: Implement Inline state */}
          {/* <option value="inline">Inline</option> */}
          <option value="hover">Inline and hover</option>
        </Form.Control>
      </label>
    </>
  );

  // @debt pass the header into Toggler's 'label' prop instead of being external like this
  const renderRadioToggle = () => (
    <div className="toggle-room">
      <h4 className="italic input-header">Enable venue radio</h4>
      <Toggler name="showRadio" forwardedRef={register} />
    </div>
  );

  const isJazzbar = templateID === VenueTemplate.jazzbar;

  const jukeboxContainerClasses = classNames("toggle-room DetailsForm", {
    "toggle-room DetailsForm--hidden": isJazzbar,
  });

  const renderJukeboxToggle = () => {
    return (
      <div className={jukeboxContainerClasses}>
        <h4 className="italic input-header">Enable Jukebox</h4>
        <Toggler name="enableJukebox" forwardedRef={register} />
      </div>
    );
  };

  const renderRadioStationInput = () => (
    <div className="input-container">
      <h4 className="italic input-header">Radio station stream URL:</h4>
      <input
        type="text"
        disabled={disable}
        name={`radioStations`}
        ref={register}
        className="wide-input-block input-centered align-left"
        placeholder="Radio station URL..."
      />
      {errors.radioStations && (
        <span className="input-error">{errors.radioStations.message}</span>
      )}
    </div>
  );

  const [userStatuses, setUserStatuses] = useState<UserStatus[]>([]);

  const {
    isShown: hasUserStatuses,
    show: showUserStatuses,
    hide: hideUserStatuses,
    toggle: toggleUserStatus,
  } = useShowHide(DEFAULT_SHOW_USER_STATUSES);

  // Because this is not using the useForm validation. The use effect needs to manually open the dropdown with user statuses.
  useEffect(() => {
    if (!sovereignVenue) return;

    const venueUserStatuses = sovereignVenue?.userStatuses ?? [];
    const venueShowUserStatus =
      sovereignVenue?.showUserStatus ?? DEFAULT_SHOW_USER_STATUSES;

    setUserStatuses(venueUserStatuses);

    if (venueShowUserStatus) {
      showUserStatuses();
    } else {
      hideUserStatuses();
    }
  }, [hideUserStatuses, showUserStatuses, sovereignVenue]);

  const removeUserStatus = (index: number) => {
    const statuses = [...userStatuses];
    statuses.splice(index, 1);
    setUserStatuses(statuses);
  };

  const addUserStatus = () =>
    setUserStatuses([
      ...userStatuses,
      { status: "", color: DEFAULT_USER_STATUS.color },
    ]);

  const updateStatusColor = (color: string, index: number) => {
    const statuses = [...userStatuses];
    statuses[index] = { color, status: statuses[index].status };
    setUserStatuses(statuses);
  };

  const updateStatusText = (
    event: React.FormEvent<HTMLInputElement>,
    index: number
  ) => {
    const statuses = [...userStatuses];

    const userStatusExists = statuses.find(
      (userStatus) => userStatus.status === event.currentTarget.value
    );

    // @debt Move user statuses to useForm with useDynamicInput, add schema for this validation instead
    if (userStatusExists) {
      setError("User statuses", {
        type: "manual",
        message: "User status already exists.",
      });
      setFormError(true);
    } else {
      setError("", "");
      setFormError(false);
    }

    statuses[index] = {
      color: statuses[index].color,
      status: event.currentTarget.value,
    };
    setUserStatuses(statuses);
  };

  const updateVenue = useCallback(
    (vals: Partial<FormValues>) => {
      const values = {
        ...vals,
        iframeUrl: vals.iframeUrl || DEFAULT_EMBED_URL,
      };

      onSubmit(values, userStatuses, hasUserStatuses);
    },
    [onSubmit, userStatuses, hasUserStatuses]
  );

  return (
    <form
      className="full-height-container"
      onSubmit={handleSubmit(updateVenue)}
    >
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

        {renderVenueNameInput()}
        {renderTaglineInput()}
        {renderDescriptionInput()}
        {renderRestrictToAdultsInput()}

        {renderHighlightImageInput()}
        {renderLogoInput()}

        {/* ATTENDEES (multiple) TITLE */}
        {renderAttendeesTitleInput()}

        {/* EVENT CHAT TITLE */}
        {renderChatTitleInput()}

        {templateID && (
          <>
            {ZOOM_URL_TEMPLATES.includes(templateID) && renderUrlInput()}
            {IFRAME_TEMPLATES.includes(templateID) &&
              renderLivestreamUrlInput()}
          </>
        )}

        {templateID &&
          BACKGROUND_IMG_TEMPLATES.includes(templateID) &&
          renderMapBackgroundInput(templateID)}

        <QuestionInput
          title="Code of conduct questions"
          fieldName="code_of_conduct_questions"
          register={register}
          hasLink
          editing={state.detailsPage?.venue.code_of_conduct_questions}
        />
        <QuestionInput
          title="Profile questions"
          fieldName="profile_questions"
          register={register}
          editing={state.detailsPage?.venue.profile_questions}
        />

        <EntranceInput
          fieldName="entrance"
          register={register}
          editing={state.detailsPage?.venue.entrance}
        />

        {renderShowScheduleToggle()}
        {templateID &&
          HAS_GRID_TEMPLATES.includes(templateID) &&
          renderShowGridToggle()}
        {renderShowBadgesToggle()}
        {renderShowNametagsToggle()}
        {templateID &&
          HAS_REACTIONS_TEMPLATES.includes(templateID) &&
          renderShowReactions()}
        {templateID &&
          HAS_REACTIONS_TEMPLATES.includes(templateID) &&
          renderShowShoutouts()}
        {renderShowRangersToggle()}
        {renderRestrictDOBToggle()}

        {templateID &&
          HAS_REACTIONS_TEMPLATES.includes(templateID) &&
          HAS_GRID_TEMPLATES.includes(templateID) &&
          renderSeatingNumberInput()}

        {renderRadioToggle()}

        {values.showRadio && renderRadioStationInput()}

        {renderJukeboxToggle()}

        <UserStatusManager
          venueId={venueId}
          checked={hasUserStatuses}
          userStatuses={userStatuses}
          onCheck={toggleUserStatus}
          onDelete={removeUserStatus}
          onAdd={addUserStatus}
          onPickColor={updateStatusColor}
          onChangeInput={updateStatusText}
        />

        {templateID &&
          HAS_GRID_TEMPLATES.includes(templateID) &&
          values.showGrid &&
          renderGridDimensionsInputs()}

        {renderParentIdInput()}

        {templateID &&
          HAS_ROOMS_TEMPLATES.includes(templateID) &&
          renderRoomAppearanceSelect()}
      </div>

      <VenueDetailsFormErrors errors={errors} />

      <div className="page-container-left-bottombar">
        {previous ? (
          <button className="btn btn-primary nav-btn" onClick={previous}>
            Go Back
          </button>
        ) : (
          <div />
        )}
        <div>
          <SubmitButton
            editing={editing}
            isSubmitting={isSubmitting}
            templateType={templateType ?? "Venue"}
          />
        </div>
      </div>
      {templateID === VenueTemplate.themecamp && (
        <div style={{ textAlign: "center" }}>
          You&apos;ll be able to add {ROOMS_TAXON.lower} to your theme camp on
          the next page
        </div>
      )}
    </form>
  );
};

interface SubmitButtonProps {
  isSubmitting: boolean;
  editing?: boolean;
  templateType: string;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  isSubmitting,
  editing,
  templateType,
}) => {
  return isSubmitting ? (
    <div className="spinner-border">
      <span className="sr-only">Loading...</span>
    </div>
  ) : (
    <input
      className="btn btn-primary"
      type="submit"
      value={editing ? `Update ${templateType}` : `Create ${templateType}`}
    />
  );
};
