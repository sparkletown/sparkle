import React from "react";
import renderer from "react-test-renderer";

// Test component
import VenueHero from "./VenueHero";

describe("<VenueHero />", () => {
  test("renders correctly", () => {
    const tree = renderer.create(<VenueHero />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
