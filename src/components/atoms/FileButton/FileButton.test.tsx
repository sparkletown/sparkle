import React from "react";
import renderer from "react-test-renderer";

// Test component
import FileButton from "./FileButton";

describe("<FileButton />", () => {
  test("renders correctly", () => {
    const tree = renderer.create(<FileButton onChange={() => {}} />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
