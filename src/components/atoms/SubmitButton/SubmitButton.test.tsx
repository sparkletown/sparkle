import React from "react";
import renderer from "react-test-renderer";

import SubmitButton from "./SubmitButton";

describe("<SubmitButton />", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<SubmitButton />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
