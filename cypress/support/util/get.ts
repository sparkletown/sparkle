const SELECTOR_ROOT = "#root";
const SELECTOR_BLANK_PAGE = "[data-bem=BlankPage]";

export const getRoot = () => cy.get(SELECTOR_ROOT);
export const getBlankPage = () => cy.get(SELECTOR_BLANK_PAGE);
export const getInput = (name: string) => cy.get(`input[name=${name}]`);
export const getByText = (text: string) => cy.contains(text);
export const getByBem = (bem: string) => cy.get(`[data-bem=${bem}]`);
