import React from "react";
import renderer from "react-test-renderer";

// Test component
import ToggleSwitch from "./ToggleSwitch";

describe("<ToggleSwitch />", () => {
  test("renders correctly", () => {
    const tree = renderer.create(<ToggleSwitch name="mySwitch" />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
