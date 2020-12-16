import { loadScript } from "./loadScript";

const ZENDESK_SCRIPT_SRC =
  "https://static.zdassets.com/ekr/snippet.js?key=57ad1fbc-d174-4561-8102-b3c8d98436d5";

const ZENDESK_SCRIPT_ID = "ze-snippet";

export const initializeZendesk = () => {
  loadScript({
    src: ZENDESK_SCRIPT_SRC,
    id: ZENDESK_SCRIPT_ID,
  });
};
