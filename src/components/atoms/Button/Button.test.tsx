import React from "react";
import renderer from "react-test-renderer";

// Test component
import Button from "./Button";

describe("<Button />", () => {
  test("renders correctly", () => {
    const tree = renderer.create(<Button text="Hello World" />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
