import React from "react";
import * as Yup from "yup";

// Hooks
import { useForm } from "react-hook-form";

// Components
import { Button, Form } from "react-bootstrap";
import ToggleSwitch from "components/atoms/ToggleSwitch";

// Typings
import { AdvancedSettingsProps } from "./AdvancedSettings.types";

// Styles
import * as S from "../Admin.styles";
import { updateVenue_v2 } from "api/admin";
import { Venue_v2_AdvancedConfig } from "types/Venue";
import { useUser } from "hooks/useUser";

// TODO: MOVE THIS TO A NEW FILE, DONT CLUTTER!
interface ToggleElementProps {
  title: string;
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  forwardRef?: any;
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
      <ToggleSwitch
        name={name}
        forwardRef={forwardRef}
        withText
        isChecked={isChecked}
        isLarge
      />

      {children}
    </S.ItemBody>
  </S.ItemWrapper>
);

const validationSchema = Yup.object().shape<Venue_v2_AdvancedConfig>({
  showGrid: Yup.boolean().notRequired(),
  columns: Yup.number().when("showGrid", {
    is: true,
    then: Yup.number().required("Columns are required!").min(1),
  }),
  radioStations: Yup.string().when("showRadio", {
    is: true,
    then: Yup.string().required("Radio stream is required!"),
  }),
  requiresDateOfBirth: Yup.bool().notRequired(),
  showBadges: Yup.bool().notRequired(),
  showRadio: Yup.bool().notRequired(),
  showRangers: Yup.bool().notRequired(),
  showZendesk: Yup.bool().notRequired(),

  // TODO: Figure out how to validate with enum values
  // roomVisibility: Yup.string().notRequired()
});

const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({ venue }) => {
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
      showGrid: venue.showGrid,
      showRadio: venue.showRadio,
      showZendesk: venue.showZendesk,
      showRangers: venue.showRangers,
    },
  });

  const { user } = useUser();

  const values = watch();

  const onSubmit = (data: Venue_v2_AdvancedConfig) => {
    if (!user) return;

    updateVenue_v2(
      {
        name: venue.name,
        ...data,
      },
      user
    );
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

  const renderRoomVisibility = () => (
    <S.ItemWrapper>
      <S.ItemHeader>
        <S.TitleWrapper>
          <S.ItemTitle>Room appearance</S.ItemTitle>
        </S.TitleWrapper>

        <S.ItemSubtitle>
          Choose how you&apos;d like your rooms to appear on the map
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

  return (
    <div>
      <h1>Advanced settings</h1>

      <Form onSubmit={handleSubmit(onSubmit)}>
        {renderShowGridToggle()}

        <ToggleElement
          forwardRef={register}
          isChecked={values.showBadges}
          name="showBadges"
          title="Show badges"
        />

        <ToggleElement
          forwardRef={register}
          isChecked={values.showZendesk}
          name="showZendesk"
          title="Show Zendesk support popup"
        />

        <ToggleElement
          forwardRef={register}
          isChecked={values.showRangers}
          name="showRangers"
          title="Show Rangers support"
        />

        <ToggleElement
          forwardRef={register}
          isChecked={values.requiresDateOfBirth}
          name="requiresDateOfBirth"
          title="Require date of birth on register"
        />

        {renderRadioToggle()}

        {renderRoomVisibility()}

        <Button type="submit" disabled={!dirty || isSubmitting}>
          Save
        </Button>
      </Form>
    </div>
  );
};

export default AdvancedSettings;
