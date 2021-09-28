import React from "react";
import { Form } from "react-bootstrap";
import { useForm } from "react-hook-form";

import { updateVenue_v2 } from "api/admin";

import { AnyVenue, VenueAdvancedConfig } from "types/venues";

import { advancedSettingsSchema } from "utils/validations";

import { useUser } from "hooks/useUser";

import { ButtonNG } from "components/atoms/ButtonNG";
import { InputField } from "components/atoms/InputField";
import { Toggler } from "components/atoms/Toggler";

import "./AdvancedSettings.scss";

export interface AdvancedSettingsProps {
  venue: AnyVenue;
  onSave: () => void;
}

const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({
  venue,
  onSave,
}) => {
  const {
    watch,
    formState: { dirty, isSubmitting },
    register,
    errors,
    handleSubmit,
  } = useForm<VenueAdvancedConfig>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    validationSchema: advancedSettingsSchema,
    defaultValues: {
      columns: venue.columns,
      radioStations: venue.radioStations ? venue.radioStations[0] : "",
      requiresDateOfBirth: venue.requiresDateOfBirth,
      showBadges: venue.showBadges,
      showNametags: venue.showNametags,
      showGrid: venue.showGrid,
      showRadio: venue.showRadio,
      attendeesTitle: venue.attendeesTitle,
      chatTitle: venue.chatTitle,
      parentId: venue.parentId ?? "",
      roomVisibility: venue.roomVisibility,
    },
  });

  const { user } = useUser();

  const values = watch();

  const updateAdvancedSettings = (data: VenueAdvancedConfig) => {
    if (!user) return;

    updateVenue_v2(
      {
        name: venue.name,
        worldId: venue.worldId,
        ...data,
      },
      user
    );

    onSave();
  };

  return (
    <div className="AdvancedSettings">
      <h1>Advanced settings</h1>

      <Form
        className="AdvancedSettings__form-container"
        onSubmit={handleSubmit(updateAdvancedSettings)}
      >
        <div className="AdvancedSettings__form-field">
          <Form.Label>
            Title of your venues attendees (For example: guests, attendees,
            partygoers)
          </Form.Label>
          <InputField
            name="attendeesTitle"
            autoComplete="off"
            placeholder="Attendees title"
            error={errors.attendeesTitle}
            ref={register}
          />
        </div>

        <div className="AdvancedSettings__form-field">
          <Form.Label>
            Your venue chat label (For example: Party, Event, Meeting)
          </Form.Label>
          <InputField
            name="chatTitle"
            autoComplete="off"
            placeholder="Event label"
            error={errors.chatTitle}
            ref={register}
          />
        </div>

        <div className="AdvancedSettings__form-field">
          <Toggler forwardedRef={register} name="showGrid" title="Show grid" />
          <Form.Label>Number of columns:</Form.Label>
          <InputField
            name="columns"
            type="number"
            autoComplete="off"
            placeholder="Enter number of grid columns"
            error={errors.columns}
            ref={register}
            disabled={!values.showGrid}
            min={1}
          />
        </div>

        <div className="AdvancedSettings__form-field">
          <Toggler
            forwardedRef={register}
            name="showBadges"
            title="Show badges"
          />
        </div>

        <div className="AdvancedSettings__form-field">
          <Form.Label>
            Show Nametags (Display user names on their avatars)
          </Form.Label>
          <Form.Control as="select" custom name="showNametags" ref={register}>
            <option value="none">None</option>
            <option value="hover">Inline and hover</option>
          </Form.Control>
        </div>

        <div className="AdvancedSettings__form-field">
          <Toggler
            forwardedRef={register}
            name="requiresDateOfBirth"
            title="Require date of birth on register"
          />
        </div>

        <div className="AdvancedSettings__form-field">
          <Toggler
            forwardedRef={register}
            name="showRadio"
            title="Enable venue radio"
          />
          <Form.Label>Radio station stream URL:</Form.Label>
          <InputField
            name="radioStations"
            error={errors.radioStations}
            ref={register}
            disabled={!values.showRadio}
          />
        </div>

        <div className="AdvancedSettings__form-field">
          <Form.Label>Room appearance</Form.Label>
          <div>Choose how you&apos;d like your rooms to appear on the map</div>
          <Form.Control as="select" custom name="roomVisibility" ref={register}>
            <option value="hover">Hover</option>
            <option value="count">Count</option>
            <option value="count/name">Count and names</option>
          </Form.Control>
        </div>

        <div className="AdvancedSettings__form-field">
          <Form.Label>
            Enter the parent venue ID, for the &quot;back&quot; button to go to,
            and for sharing events in the schedule
          </Form.Label>
          <div>
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
          <InputField name="parentId" error={errors.parentId} ref={register} />
        </div>

        <div className="AdvancedSettings__form-field">
          <ButtonNG
            className="AdvancedSettings__save-button"
            type="submit"
            variant="primary"
            loading={isSubmitting}
            disabled={!dirty || isSubmitting}
          >
            Save
          </ButtonNG>
        </div>
      </Form>
    </div>
  );
};

export default AdvancedSettings;
