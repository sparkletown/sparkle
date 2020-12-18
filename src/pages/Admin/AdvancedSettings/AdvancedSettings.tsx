import React from "react";

// Hooks
import { useForm } from "react-hook-form";

// Components
import { Button, Form } from "react-bootstrap";
import ToggleSwitch from "components/atoms/ToggleSwitch";

// Typings
import { AdvancedSettingsProps } from "./AdvancedSettings.types";

// Styles
import * as S from "../Admin.styles"

// TODO: MOVE THIS TO A NEW FILE, DONT CLUTTER!
interface ToggleElementProps {
  title: string;
  name: string;
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
      <S.ItemTitle>{title}</S.ItemTitle>
    </S.ItemHeader>

    <S.ItemBody>
      <ToggleSwitch
        name={name}
        forwardRef={forwardRef}
        withText
        isChecked={isChecked}
      />

      {children}
    </S.ItemBody>
  </S.ItemWrapper>
);

const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({ venue }) => {
  const {
    watch,
    formState: { dirty },
    register,
    handleSubmit,
  } = useForm<any>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      columns: venue.columns,
      radioStations: venue.radioStations ? venue.radioStations[0] : "",
      requiresDateOfBirth: venue.requiresDateOfBirth,
      showBadges: venue.showBadges,
      showGrid: venue.showGrid,
      showRadio: venue.showRadio,
      showZendesk: venue.showZendesk,
    },
  });

  const values = watch();

  const onSubmit = () => console.log("- Submitting - ", values);

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
      </Form.Group>
    </ToggleElement>
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

        <Button type="submit" disabled={!dirty}>
          Save
        </Button>
      </Form>
    </div>
  );
};

export default AdvancedSettings;
