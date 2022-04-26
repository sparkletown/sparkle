import { SpaceSlugLocation } from "src/types/id";

const URL_ADMIN = "/admin";
const URL_INSIDE_SPACE = "/in";

const WORLD_PREFIX = "/w/";
const SPACE_PREFIX = "/s/";

export const visitAdmin = () => cy.visit(URL_ADMIN);
export const visitSpaceInside = ({ worldSlug, spaceSlug }: SpaceSlugLocation) =>
  cy.visit(
    URL_INSIDE_SPACE + WORLD_PREFIX + worldSlug + SPACE_PREFIX + spaceSlug
  );
