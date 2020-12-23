import React from "react";
import renderer from "react-test-renderer";

// Test component
import ImageInput from "./ImageInput";

// Typings
import { ImageInputProps } from "./ImageInput.types";

describe("<ImageInput />", () => {
  test("renders correctly", () => {
    const ref = React.createRef();
    const props = {
      name: "imageInputName",
      onChange: () => {},
      forwardRef: ref,
    } as ImageInputProps;

    const tree = renderer.create(<ImageInput {...props} />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
