import React, { useCallback, useMemo, useState } from "react";
import { Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import * as Yup from "yup";

import {
  DEFAULT_USER_STATUS,
  MAXIMUM_PARTYMAP_COLUMNS_COUNT,
  MINIMUM_PARTYMAP_COLUMNS_COUNT,
  ROOM_TAXON,
  ROOMS_TAXON,
} from "settings";

import { updateVenue_v2 } from "api/admin";

import { UsernameVisibility, UserStatus } from "types/User";
import { Venue_v2_AdvancedConfig } from "types/venues";

import { useUser } from "hooks/useUser";

import { UserStatusPanel } from "components/molecules/UserStatusManager/components/UserStatusPanel";

import { ButtonNG } from "components/atoms/ButtonNG";
import { Checkbox } from "components/atoms/Checkbox";

import * as S from "../Admin.styles";

import { AdvancedSettingsProps } from "./AdvancedSettings.types";

import "./AdvancedSettings.scss";

// TODO: MOVE THIS TO A NEW FILE, DONT CLUTTER!
interface ToggleElementProps {
  title: string;
  name: string;
  forwardRef?: (
    value: React.RefObject<HTMLInputElement> | HTMLInputElement | null
  ) => void;
  isChecked?: boolean;
}
const ToggleElement: React.FC<ToggleElementProps> = ({
  title,
  name,
  forwardRef,
  isChecked,
  children,
}) => (
  <S.ItemWrapper>
    <S.ItemHeader>
      <S.TitleWrapper>
        <S.ItemTitle>{title}</S.ItemTitle>
      </S.TitleWrapper>
    </S.ItemHeader>

    <S.ItemBody>
      <Checkbox
        name={name}
        forwardedRef={forwardRef}
        defaultChecked={isChecked}
        toggler
      />

      {children}
    </S.ItemBody>
  </S.ItemWrapper>
);

const validationSchema = Yup.object().shape<Venue_v2_AdvancedConfig>({
  showGrid: Yup.boolean().notRequired(),
  columns: Yup.number().when("showGrid", {
    is: true,
    then: Yup.number()
      .required(
        `The columns need to be between ${MINIMUM_PARTYMAP_COLUMNS_COUNT} and ${MAXIMUM_PARTYMAP_COLUMNS_COUNT}.`
      )
      .min(MINIMUM_PARTYMAP_COLUMNS_COUNT)
      .max(MAXIMUM_PARTYMAP_COLUMNS_COUNT),
  }),
  radioStations: Yup.string().when("showRadio", {
    is: true,
    then: Yup.string().required("Radio stream is required!"),
  }),
  requiresDateOfBirth: Yup.bool().notRequired(),
  showBadges: Yup.bool().notRequired(),
  showNametags: Yup.mixed()
    .oneOf(Object.values(UsernameVisibility))
    .notRequired(),
  showRadio: Yup.bool().notRequired(),
  showUserStatus: Yup.bool().notRequired(),

  // TODO: Figure out how to validate with enum values
  // roomVisibility: Yup.string().notRequired()
});

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
  } = useForm<Venue_v2_AdvancedConfig>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    validationSchema: validationSchema,
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
      roomVisibility: venue.roomVisibility,
      showUserStatus: venue.showUserStatus,
      userStatuses: venue.userStatuses,
    },
  });

  const { user } = useUser();

  const values = watch();

  const onSubmit = (data: Venue_v2_AdvancedConfig) => {
    if (!user) return;

    updateVenue_v2(
      {
        name: venue.name,
        worldId: venue.worldId,
        ...data,
        userStatuses,
      },
      user
    );

    onSave();
  };

  const renderShowGridToggle = () => (
    <ToggleElement
      forwardRef={register}
      isChecked={values.showGrid}
      name="showGrid"
      title="Show Grid"
    >
      <Form.Group>
        <Form.Label>Number of columns:</Form.Label>
        <Form.Control
          name="columns"
          type="number"
          placeholder="Enter number of grid columns"
          ref={register}
          custom
          disabled={!values.showGrid}
          min={1}
        />
        {errors.columns && (
          <span className="input-error">{errors.columns.message}</span>
        )}
      </Form.Group>
    </ToggleElement>
  );

  const renderRadioToggle = () => (
    <ToggleElement
      forwardRef={register}
      isChecked={values.showRadio}
      name="showRadio"
      title="Enable venue radio"
    >
      <Form.Group>
        <Form.Label>Radio station stream URL:</Form.Label>
        <Form.Control
          name="radioStations"
          ref={register}
          custom
          disabled={!values.showRadio}
        />
        {errors.radioStations && (
          <span className="input-error">{errors.radioStations.message}</span>
        )}
      </Form.Group>
    </ToggleElement>
  );

  const renderShowNametags = () => (
    <S.ItemWrapper>
      <S.ItemHeader>
        <S.TitleWrapper>
          <S.ItemTitle>Show Nametags</S.ItemTitle>
        </S.TitleWrapper>

        <S.ItemSubtitle>Display user names on their avatars</S.ItemSubtitle>
      </S.ItemHeader>

      <S.ItemBody>
        <Form.Control as="select" custom name="showNametags" ref={register}>
          <option value="none">None</option>
          {/* TODO: Implement Inline state */}
          {/* <option value="inline">Inline</option> */}
          <option value="hover">Inline and hover</option>
        </Form.Control>
      </S.ItemBody>
    </S.ItemWrapper>
  );

  const renderRoomVisibility = () => (
    <S.ItemWrapper>
      <S.ItemHeader>
        <S.TitleWrapper>
          <S.ItemTitle>{ROOM_TAXON.capital} appearance</S.ItemTitle>
        </S.TitleWrapper>

        <S.ItemSubtitle>
          Choose how you&apos;d like your {ROOMS_TAXON.lower} to appear on the
          map
        </S.ItemSubtitle>
      </S.ItemHeader>

      <S.ItemBody>
        <Form.Control as="select" custom name="roomVisibility" ref={register}>
          <option value="hover">Hover</option>
          <option value="count">Count</option>
          <option value="count/name">Count and names</option>
        </Form.Control>
      </S.ItemBody>
    </S.ItemWrapper>
  );

  const renderAttendeesTitleInput = () => (
    <S.ItemWrapper>
      <S.ItemHeader>
        <S.TitleWrapper>
          <S.ItemTitle>Title of your venues attendees</S.ItemTitle>
        </S.TitleWrapper>
        <S.ItemSubtitle>
          For example: guests, attendees, partygoers.
        </S.ItemSubtitle>
      </S.ItemHeader>

      <S.ItemBody>
        <Form.Control
          name="attendeesTitle"
          placeholder="Attendees title"
          ref={register}
          custom
          type="text"
        />
        {errors.attendeesTitle && (
          <span className="input-error">{errors.attendeesTitle.message}</span>
        )}
      </S.ItemBody>
    </S.ItemWrapper>
  );

  const renderChatTitleInput = () => (
    <S.ItemWrapper>
      <S.ItemHeader>
        <S.TitleWrapper>
          <S.ItemTitle>Your venue chat label</S.ItemTitle>
        </S.TitleWrapper>
        <S.ItemSubtitle>For example: Party, Event, Meeting</S.ItemSubtitle>
      </S.ItemHeader>

      <S.ItemBody>
        <Form.Control
          name="chatTitle"
          placeholder="Event label"
          ref={register}
          custom
          type="text"
        />
        {errors.chatTitle && (
          <span className="input-error">{errors.chatTitle.message}</span>
        )}
      </S.ItemBody>
    </S.ItemWrapper>
  );

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

  const renderUserStatusesToggle = () => (
    <>
      <ToggleElement
        forwardRef={register}
        isChecked={values.showUserStatus}
        name="showUserStatus"
        title="User statuses"
      >
        <Form.Group>
          <Form.Label>
            Attendees can set a special status on their profile (minimum 2)
            <br />
            Example: Available, Busy, is sleeping...
          </Form.Label>
        </Form.Group>
      </ToggleElement>
      {values.showUserStatus && (
        <>
          {renderVenueUserStatuses}
          <ButtonNG variant="primary" iconName={faPlus} onClick={addUserStatus}>
            Add a status
          </ButtonNG>
        </>
      )}
    </>
  );

  return (
    <div>
      <h1>Advanced settings</h1>

      <Form onSubmit={handleSubmit(onSubmit)}>
        {renderAttendeesTitleInput()}
        {renderChatTitleInput()}

        {renderShowGridToggle()}

        <ToggleElement
          forwardRef={register}
          isChecked={values.showBadges}
          name="showBadges"
          title="Show badges"
        />

        {renderShowNametags()}

        <ToggleElement
          forwardRef={register}
          isChecked={values.requiresDateOfBirth}
          name="requiresDateOfBirth"
          title="Require date of birth on register"
        />

        {renderRadioToggle()}

        {renderUserStatusesToggle()}

        {renderRoomVisibility()}

        <ButtonNG
          className="AdvancedSettings__save-button"
          type="submit"
          loading={isSubmitting}
          disabled={!dirty || isSubmitting}
        >
          Save
        </ButtonNG>
      </Form>
    </div>
  );
};

export default AdvancedSettings;
