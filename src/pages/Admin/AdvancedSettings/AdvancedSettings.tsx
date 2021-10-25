import React, { useCallback, useMemo, useState } from "react";
import { Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import {
  DEFAULT_USER_STATUS,
  DISABLED_DUE_TO_1253,
  ROOM_TAXON,
  ROOMS_TAXON,
} from "settings";

import { updateVenue_v2 } from "api/admin";

import { UserStatus } from "types/User";
import { AnyVenue, RoomVisibility, VenueAdvancedConfig } from "types/venues";

import { WithId } from "utils/id";
import { advancedSettingsSchema } from "utils/validations";

import { useUser } from "hooks/useUser";

import { UserStatusPanel } from "components/molecules/UserStatusManager/components/UserStatusPanel";

import { ButtonNG } from "components/atoms/ButtonNG";
import { InputField } from "components/atoms/InputField";
import { PortalVisibility } from "components/atoms/PortalVisibility";
import { Toggler } from "components/atoms/Toggler";

import "./AdvancedSettings.scss";

export interface AdvancedSettingsProps {
  venue: WithId<AnyVenue>;
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
      columns: venue.columns ?? 0,
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
      showUserStatus: venue.showUserStatus,
      userStatuses: venue.userStatuses,
      hasSocialLoginEnabled: venue.hasSocialLoginEnabled,
    },
  });

  const { user } = useUser();

  const values = watch();

  const [roomVisibility, updateRoomVisibility] = useState<RoomVisibility>();

  const validateParentId = useCallback((parentId, checkedIds) => {
    if (checkedIds.includes(parentId)) return false;

    if (!parentId) return true;

    const parentVenue = worldParentVenues.find(
      (venue) => venue.id === parentId
    );

    if (!parentVenue) return true;

    validateParentId(parentVenue?.parentId, [...checkedIds, parentId]);
  }, []);

  // @debt consider useAsyncFn for updating to back end and displaying loading/error in the UI
  const updateAdvancedSettings = (data: VenueAdvancedConfig) => {
    if (!user) return;

    updateVenue_v2(
      {
        name: venue.name,
        worldId: venue.worldId,
        ...data,
        userStatuses,
        roomVisibility,
      },
      user
    ).catch((e) => console.error(AdvancedSettings.name, e));

    onSave();
  };

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

        {!DISABLED_DUE_TO_1253 && (
          <div className="AdvancedSettings__form-field">
            <Toggler
              forwardedRef={register}
              name="showGrid"
              title="Show grid"
            />
            <Form.Label>Number of columns: </Form.Label>
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
        )}

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
          <Form.Label>Radio station stream URL: </Form.Label>
          <InputField
            name="radioStations"
            error={errors.radioStations}
            ref={register}
            disabled={!values.showRadio}
          />
        </div>

        <div className="AdvancedSettings__form-field">
          <Toggler
            forwardedRef={register}
            name="hasSocialLoginEnabled"
            title="Social Login"
          />
          <Form.Label>
            Users can login using Google/Facebook/Okta social networks
          </Form.Label>
        </div>

        <div className="AdvancedSettings__form-field">
          <Toggler
            forwardedRef={register}
            name="showUserStatus"
            title="Show user status"
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
        </div>

        <div className="AdvancedSettings__form-field">
          <Form.Label>{ROOM_TAXON.capital} appearance</Form.Label>
          <div>
            Choose how you&apos; d like your {ROOMS_TAXON.lower} to appear on
            the map
          </div>
          <PortalVisibility updateRoomVisibility={updateRoomVisibility} />
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
