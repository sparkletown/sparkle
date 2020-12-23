import React from "react";
import renderer from "react-test-renderer";

// Test component
import DetailsPreview from "./DetailsPreview";

describe("<DetailsPreview />", () => {
  test("renders correctly", () => {
    const tree = renderer.create(<DetailsPreview />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
