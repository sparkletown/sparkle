import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { FieldErrors, useForm } from "react-hook-form";

import {
  BACKGROUND_IMG_TEMPLATES,
  BANNER_MESSAGE_TEMPLATES,
  DEFAULT_AUDIENCE_COLUMNS_NUMBER,
  DEFAULT_AUDIENCE_ROWS_NUMBER,
  DEFAULT_SHOW_SCHEDULE,
  DEFAULT_SHOW_USER_STATUSES,
  DEFAULT_USER_STATUS,
  HAS_GRID_TEMPLATES,
  HAS_REACTIONS_TEMPLATES,
  HAS_ROOMS_TEMPLATES,
  IFRAME_TEMPLATES,
  ZOOM_URL_TEMPLATES,
} from "settings";

import { createUrlSafeName } from "api/admin";

import { UserStatus } from "types/User";
import { AnyVenue, VenueTemplate } from "types/venues";

import { venueLandingUrl } from "utils/url";
import { createJazzbar } from "utils/venue";

import { useShowHide } from "hooks/useShowHide";

import EntranceInput from "pages/Admin/Venue/EntranceInput";
import QuestionInput from "pages/Admin/Venue/QuestionInput";
import { FormValues } from "pages/Admin/Venue/VenueDetailsForm";
import { VenueDetailsFormErrors } from "pages/Admin/Venue/VenueDetailsFormErrors";
import { WizardPage } from "pages/Admin/Venue/VenueWizard";

import { ImageInput } from "components/molecules/ImageInput";
import { ImageCollectionInput } from "components/molecules/ImageInput/ImageCollectionInput";
import { UserStatusManager } from "components/molecules/UserStatusManager";

import { AutoSpan } from "components/atoms/AutoSpan";
import { ButtonNG } from "components/atoms/ButtonNG";
import { Toggler } from "components/atoms/Toggler";

// @debt Refactor this constant into settings, or types/templates, or similar?
// @debt remove reference to legacy 'Theme Camp' here, both should probably just
//  display the same text as themecamp is now essentially just an alias of partymap
const BACKGROUND_TEXT_BY_VENUE: Record<string, string> = {
  [VenueTemplate.themecamp]: "Theme Camp",
  [VenueTemplate.partymap]: "Party Map",
};

interface DetailsFormLeftProps
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
    values: Partial<FormValues>,
    userStatuses: UserStatus[],
    showUserStatuses: boolean
  ) => Promise<void>;
  errors: FieldErrors<FormValues>;
  editing?: boolean;
  formError: boolean;
  setFormError: (value: boolean) => void;
}

export const VenueDetailsSubForm: React.FC<DetailsFormLeftProps> = ({
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
  const {
    adultContent,
    bannerImageFile,
    bannerImageUrl,
    logoImageFile,
    logoImageUrl,
    mapBackgroundImageFile,
    mapBackgroundImageUrl,
    name,
    showGrid,
    showRadio,
  } = watch();

  const urlSafeName = name
    ? `${window.location.host}${venueLandingUrl(createUrlSafeName(name))}`
    : undefined;
  const {
    code_of_conduct_questions: codeOfConductQuestions,
    entrance,
    profile_questions: profileQuestions,
  } = state.detailsPage?.venue ?? {};
  const { name: templateName, template } = state.templatePage?.template ?? {};

  const defaultVenue = createJazzbar({});
  const { description, subtitle } =
    defaultVenue.config?.landingPageConfig ?? {};

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
      ({ status }) => status === event.currentTarget.value
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

  if (Object.entries(errors).length) {
    console.log(
      VenueDetailsSubForm.name,
      "errors:",
      errors,
      "formError:",
      formError
    );
  }

  return (
    <form
      className="DetailsFormLeft full-height-container"
      onSubmit={handleSubmit((values) =>
        onSubmit(values, userStatuses, hasUserStatuses)
      )}
    >
      <input type="hidden" name="template" value={template} ref={register} />
      <div className="scrollable-content">
        <h4 className="italic" style={{ fontSize: "30px" }}>{`${
          editing ? "Edit" : "Create"
        } your ${templateName}`}</h4>
        <p
          className="small light"
          style={{ marginBottom: "2rem", fontSize: "16px" }}
        >
          You can change anything except for the name of your venue later
        </p>

        {/*VENUE NAME*/}
        {editing ? (
          <div className="DetailsFormLeft__venue-name DetailsFormLeft__venue-name--editing input-container">
            <h4 className="italic input-header">
              Your {templateName}: {name}
            </h4>
            <input type="hidden" name="name" ref={register} value={name} />
            <AutoSpan variant="info">
              The URL of your venue will be: <b>{urlSafeName}</b>
            </AutoSpan>
          </div>
        ) : (
          <div className="DetailsFormLeft__venue-name DetailsFormLeft__venue-name--viewing input-container">
            <h4 className="italic input-header">Name your {templateName}</h4>
            <input
              disabled={isSubmitting}
              name="name"
              ref={register}
              className="align-left"
              placeholder={`My ${templateName} name`}
            />
            <AutoSpan variant="error">{errors.name?.message}</AutoSpan>
            {!errors.name && urlSafeName && (
              <AutoSpan variant="info">
                The URL of your venue will be: <b>{urlSafeName}</b>
              </AutoSpan>
            )}
          </div>
        )}

        {/*TAGLINE*/}
        <div className="DetailsFormLeft__tag-line input-container">
          <h4 className="italic input-header">The venue tagline</h4>
          <input
            disabled={isSubmitting}
            name="subtitle"
            ref={register}
            className="wide-input-block align-left"
            placeholder={subtitle}
          />
          <AutoSpan variant="error">{errors.subtitle?.message}</AutoSpan>
        </div>

        {/*DESCRIPTION*/}
        <div className="DetailsFormLeft__description input-container">
          <h4 className="italic input-header">Long description</h4>
          <textarea
            disabled={isSubmitting}
            name="description"
            ref={register}
            className="wide-input-block input-centered align-left"
            placeholder={description}
          />
          <AutoSpan variant="error">{errors.description?.message}</AutoSpan>
        </div>

        {/*RESTRICT TO ADULTS*/}
        <div className="DetailsFormLeft__restrict-to-adults input-container">
          <label
            htmlFor="chkadultContent"
            className={`checkbox ${
              watch("adultContent", false) && "checkbox-checked"
            }`}
          >
            Restrict entry to adults aged 18+
          </label>
          <input
            type="checkbox"
            id="chkadultContent"
            name="adultContent"
            defaultChecked={adultContent}
            ref={register}
          />
        </div>

        {/*BANNER PHOTO*/}
        <div className="DetailsFormLeft__banner-photo input-container">
          <h4 className="italic input-header">Upload a banner photo</h4>
          <ImageInput
            disabled={isSubmitting}
            name="bannerImageFile"
            image={bannerImageFile}
            remoteUrlInputName="bannerImageUrl"
            remoteImageUrl={bannerImageUrl}
            register={register}
            setValue={setValue}
            error={errors.bannerImageFile || errors.bannerImageUrl}
          />
        </div>

        {/*LOGO*/}
        <div className="DetailsFormLeft__logo input-container">
          <h4 className="italic input-header">Upload a logo</h4>
          <ImageInput
            disabled={isSubmitting}
            register={register}
            setValue={setValue}
            image={logoImageFile}
            remoteUrlInputName="logoImageUrl"
            remoteImageUrl={logoImageUrl}
            name="logoImageFile"
            containerClassName="host-icon-container"
            imageClassName="host-icon"
            error={errors.logoImageFile || errors.logoImageUrl}
          />
        </div>

        {/*ANNOUNCEMENT*/}
        {template && BANNER_MESSAGE_TEMPLATES.includes(template) && (
          <>
            <h4 className="DetailsFormLeft__announcement italic input-header">
              Show an announcement in the venue (or leave blank for none)
            </h4>
            <input
              type="text"
              disabled={isSubmitting}
              name="bannerMessage"
              ref={register}
              className="wide-input-block input-centered align-left"
              placeholder="Enter your announcement"
            />
            <AutoSpan variant="error">{errors.bannerMessage?.message}</AutoSpan>
          </>
        )}

        {/* ATTENDEES (multiple) TITLE */}
        <div className="DetailsFormLeft__attendees input-container">
          <h4 className="italic input-header">
            Title of your venues attendees
          </h4>
          <div style={{ fontSize: "16px" }}>
            For example: guests, attendees, partygoers.
          </div>
          <input
            type="text"
            disabled={isSubmitting}
            name="attendeesTitle"
            ref={register}
            className="wide-input-block input-centered align-left"
            placeholder="Attendees title"
          />
          <AutoSpan variant="error">{errors.attendeesTitle?.message}</AutoSpan>
        </div>

        {/* EVENT CHAT TITLE */}
        <div className="DetailsFormLeft__chat-title input-container">
          <h4 className="italic input-header">Your venue type label</h4>
          <div style={{ fontSize: "16px" }}>
            For example: Party, Event, Meeting
          </div>
          <input
            type="text"
            disabled={isSubmitting}
            name="chatTitle"
            ref={register}
            className="wide-input-block input-centered align-left"
            placeholder="Event label"
          />
          <AutoSpan variant="error">{errors.chatTitle?.message}</AutoSpan>
        </div>

        {/*ZOOM URL*/}
        {template && ZOOM_URL_TEMPLATES.includes(template) && (
          <div className="DetailsFormLeft__zoom-url input-container">
            <h4 className="italic input-header">URL</h4>
            <div style={{ fontSize: "16px" }}>
              Please post a URL to, for example, a Zoom room, Twitch stream,
              other Universe, or any interesting thing out there on the open
              web.
            </div>
            <textarea
              disabled={isSubmitting}
              name="zoomUrl"
              ref={register}
              className="wide-input-block input-centered align-left"
              placeholder="https://us02web.zoom.us/j/654123654123"
            />
            <AutoSpan variant="error">{errors.zoomUrl?.message}</AutoSpan>
          </div>
        )}

        {/*LIVE STREAM URL*/}
        {template && IFRAME_TEMPLATES.includes(template) && (
          <div className="DetailsFormLeft__live-stream-url input-container">
            <div className="input-title">
              Livestream URL, or embed URL, for people to view in your venue
            </div>
            <div className="input-title">
              (Enter an embeddable URL link. For now there is a placeholder
              video, so you can edit this later.)
            </div>

            {/* NOTE: the default embedded video is the "Intro to Sparkle" video*/}
            <textarea
              disabled={isSubmitting}
              name="iframeUrl"
              ref={register}
              className="wide-input-block input-centered align-left"
              value="https://player.vimeo.com/video/512606583?h=84853fbd28"
            />
            <AutoSpan variant="error">{errors.iframeUrl?.message}</AutoSpan>
          </div>
        )}

        {/*MAP BACKGROUND*/}
        {template && BACKGROUND_IMG_TEMPLATES.includes(template) && (
          <div className="DetailsFormLeft__map-background input-container">
            <h4 className="italic input-header">
              Choose the background for your
              {` ${BACKGROUND_TEXT_BY_VENUE[template] ?? "Experience"}`}
            </h4>

            <ImageCollectionInput
              collectionPath="assets/mapBackgrounds"
              containerClassName="input-square-container"
              disabled={isSubmitting}
              error={
                errors.mapBackgroundImageFile || errors.mapBackgroundImageUrl
              }
              fieldName="mapBackgroundImage"
              image={mapBackgroundImageFile}
              imageClassName="input-square-image"
              imageType="backgrounds"
              imageUrl={mapBackgroundImageUrl}
              register={register}
              setValue={setValue}
            />
          </div>
        )}

        <QuestionInput
          title="Code of conduct questions"
          fieldName="code_of_conduct_questions"
          register={register}
          hasLink
          editing={codeOfConductQuestions}
        />
        <QuestionInput
          title="Profile questions"
          fieldName="profile_questions"
          register={register}
          editing={profileQuestions}
        />

        <EntranceInput
          fieldName="entrance"
          register={register}
          editing={entrance}
        />

        {/*SHOW SCHEDULE*/}
        {/*@debt pass the header into Toggler's 'label' prop instead of being external like this*/}
        <div className="DetailsFormLeft__show-schedule toggle-room">
          <h4 className="italic input-header">Show Schedule</h4>
          <Toggler
            name="showSchedule"
            forwardedRef={register}
            defaultToggled={DEFAULT_SHOW_SCHEDULE}
          />
        </div>

        {/*SHOW GRID*/}
        {template && HAS_GRID_TEMPLATES.includes(template) && (
          // @debt pass the header into Toggler's 'label' prop instead of being external like this
          <div className="DetailsFormLeft__show-grid toggle-room">
            <h4 className="italic input-header">Show grid layout</h4>
            <Toggler name="showGrid" forwardedRef={register} />
          </div>
        )}

        {/*SHOW BADGES*/}
        {/*@debt pass the header into Toggler's 'label' prop instead of being external like this*/}
        <div className="DetailsFormLeft__show-badges toggle-room">
          <h4 className="italic input-header">Show badges</h4>
          <Toggler name="showBadges" forwardedRef={register} />
        </div>

        {/*SHOW NAME TAGS*/}
        <>
          <h4 className="DetailsFormLeft__show-nametags-title italic input-header">
            Display user names on their avatars
          </h4>
          <label className="DetailsFormLeft__show-nametags-input input-container">
            <Form.Control as="select" name="showNametags" ref={register} custom>
              <option value="none">None</option>
              {/* TODO: Implement Inline state */}
              {/* <option value="inline">Inline</option> */}
              <option value="hover">Inline and hover</option>
            </Form.Control>
          </label>
        </>

        {/*SHOW REACTIONS*/}
        {/*@debt pass the header into Toggler's 'label' prop instead of being external like this*/}
        {template && HAS_REACTIONS_TEMPLATES.includes(template) && (
          <div className="DetailsFormLeft__show-reactions toggle-room">
            <h4 className="italic input-header">Show reactions</h4>
            <Toggler name="showReactions" forwardedRef={register} />
          </div>
        )}

        {/*SHOW SHOUTOUTS*/}
        {/*@debt pass the header into Toggler's 'label' prop instead of being external like this*/}
        {template && HAS_REACTIONS_TEMPLATES.includes(template) && (
          <div className="DetailsFormLeft__show-shoutouts toggle-room">
            <h4 className="italic input-header">Show shoutouts</h4>
            <Toggler name="showShoutouts" forwardedRef={register} />
          </div>
        )}

        {/*SHOW RANGERS*/}
        {/*@debt pass the header into Toggler's 'label' prop instead of being external like this*/}
        <div className="DetailsFormLeft__show-rangers toggle-room">
          <h4 className="italic input-header">Show Rangers support</h4>
          <Toggler name="showRangers" forwardedRef={register} />
        </div>

        {/*RESTRICT DOB*/}
        {/*@debt pass the header into Toggler's 'label' prop instead of being external like this*/}
        <div className="DetailsFormLeft__restrict-dob toggle-room">
          <h4 className="italic input-header">
            Require date of birth on register
          </h4>
          <Toggler name="requiresDateOfBirth" forwardedRef={register} />
        </div>

        {/*SEATING NUMBER*/}
        {template &&
          HAS_REACTIONS_TEMPLATES.includes(template) &&
          HAS_GRID_TEMPLATES.includes(template) && (
            <>
              <div className="DetailsFormLeft__auditorium-columns input-container">
                <h4 className="italic input-header">Number of seats columns</h4>
                <input
                  disabled={isSubmitting}
                  defaultValue={DEFAULT_AUDIENCE_COLUMNS_NUMBER}
                  min={5}
                  name="auditoriumColumns"
                  type="number"
                  ref={register}
                  className="align-left"
                  placeholder="Number of seats columns"
                />
                <AutoSpan variant="error">
                  {errors.auditoriumColumns?.message}
                </AutoSpan>
              </div>
              <div className="DetailsFormLeft__auditorium-rows input-container">
                <h4 className="italic input-header">Number of seats rows</h4>
                <input
                  disabled={isSubmitting}
                  defaultValue={DEFAULT_AUDIENCE_ROWS_NUMBER}
                  name="auditoriumRows"
                  type="number"
                  ref={register}
                  className="align-left"
                  placeholder="Number of seats rows"
                  min={5}
                />
                <AutoSpan variant="error">
                  {errors.auditoriumRows?.message}
                </AutoSpan>
              </div>
            </>
          )}

        {/*SHOW RADIO*/}
        {/*@debt pass the header into Toggler's 'label' prop instead of being external like this*/}
        <div className="DetailsFormLeft__show-radio toggle-room">
          <h4 className="italic input-header">Enable venue radio</h4>
          <Toggler name="showRadio" forwardedRef={register} />
        </div>

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

        {/*SHOW RADIO*/}
        {showRadio && (
          <div className="DetailsFormLeft__radio-station input-container">
            <h4 className="italic input-header">Radio station stream URL:</h4>
            <input
              type="text"
              disabled={isSubmitting}
              name="radioStations"
              ref={register}
              className="wide-input-block input-centered align-left"
              placeholder="Radio station URL..."
            />
            <AutoSpan variant="error">{errors.radioStations?.message}</AutoSpan>
          </div>
        )}

        {/*GRID DIMENSIONS*/}
        {template && showGrid && HAS_GRID_TEMPLATES.includes(template) && (
          <>
            <div className="DetailsFormLeft__grid-dimensions input-container">
              <h4 className="italic input-header">Number of columns</h4>
              <input
                disabled={isSubmitting}
                defaultValue={1}
                name="columns"
                type="number"
                ref={register}
                className="align-left"
                placeholder="Number of grid columns"
              />
              <AutoSpan variant="error">{errors.columns?.message}</AutoSpan>
            </div>
            <div className="input-container">
              <h4 className="italic input-header">Number of rows</h4>
              <div>
                Not editable. The number of rows is derived from the number of
                specified columns and the width:height ratio of the party map,
                to keep the two aligned.
              </div>
            </div>
          </>
        )}

        {/*PARENT ID*/}
        <div className="DetailsFormLeft__parent-id input-container">
          <h4 className="italic input-header">
            Enter the parent venue ID, for the &quot;back&quot; button to go to,
            and for sharing events in the schedule
          </h4>
          <div style={{ fontSize: "16px" }}>
            The nav bar can show a &quot;back&quot; button if you enter an ID
            here. Clicking &quot;back&quot; will return the user to the venue
            whose ID you enter. Additionally, the events you add here will be
            shown to users while they are on all other venues which share the
            parent venue ID you enter here, as well as in the parent venue. The
            value is a venue ID. Enter the venue ID you wish to use. A venue ID
            is the part of the URL after /in/, so eg. for{" "}
            <i>sparkle.space/in/abcdef</i> you would enter <i>abcdef</i>
            below
          </div>
          <input
            type="text"
            disabled={isSubmitting}
            name="parentId"
            ref={register}
            className="wide-input-block input-centered align-left"
            placeholder="abcdef"
          />
          <AutoSpan variant="error">{errors.parentId?.message}</AutoSpan>
        </div>

        {/*ROOM APPEARANCE*/}
        {template && HAS_ROOMS_TEMPLATES.includes(template) && (
          <>
            <h4 className="DetailsFormLeft__room-appearance-title italic input-header">
              Choose how you&apos;d like your rooms to appear on the map
            </h4>
            <div className="DetailsFormLeft__room-appearance-input input-container">
              <Form.Control
                as="select"
                name="roomVisibility"
                ref={register}
                custom
              >
                <option value="hover">Hover</option>
                <option value="count">Count</option>
                <option value="count/name">Count and names</option>
              </Form.Control>
            </div>
          </>
        )}
      </div>

      <VenueDetailsFormErrors errors={errors} />

      <div className="DetailsFormLeft__bottom-bar page-container-left-bottombar">
        {previous && <ButtonNG onClick={previous}>Go Back</ButtonNG>}
        <ButtonNG type="submit" variant="primary" loading={isSubmitting}>
          {editing ? `Update ${templateName}` : `Create ${templateName}`}
        </ButtonNG>
      </div>
      {template === VenueTemplate.themecamp && (
        <div style={{ textAlign: "center" }}>
          You&apos;ll be able to add rooms to your theme camp on the next page
        </div>
      )}
    </form>
  );
};
