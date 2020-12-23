import React from "react";
import renderer from "react-test-renderer";

// Test component
import Legend from "./Legend";

describe("<Legend />", () => {
  test("renders correctly", () => {
    const tree = renderer.create(<Legend text="Legent Test" />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
