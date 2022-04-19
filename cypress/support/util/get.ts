const SELECTOR_ROOT = "#root";
const SELECTOR_BLANK_PAGE = "[data-bem=BlankPage]";

export const getRoot = () => cy.get(SELECTOR_ROOT);
export const getBlankPage = () => cy.get(SELECTOR_BLANK_PAGE);
