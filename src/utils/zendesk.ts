/* eslint-disable @typescript-eslint/no-explicit-any */

import { ZENDESK_URL_PREFIXES } from "settings";
import { loadScript } from "./loadScript";

const ZENDESK_SCRIPT_SRC =
  "https://static.zdassets.com/ekr/snippet.js?key=57ad1fbc-d174-4561-8102-b3c8d98436d5";

const ZENDESK_SCRIPT_ID = "ze-snippet";
const ZENDESK_WARMUP_DELAY_MS = 6000;

export const initializeZendesk = () => {
  loadScript({
    src: ZENDESK_SCRIPT_SRC,
    id: ZENDESK_SCRIPT_ID,
    onload: hideZendeskWidget,
  });
};

const hideZendeskWidget = () => {
  if ((window as any).zE) {
    const showZendeskForThisPath = ZENDESK_URL_PREFIXES.find((prefix) =>
      window.location.pathname.startsWith(prefix)
    );

    if (!showZendeskForThisPath) {
      (window as any).zE("webWidget", "hide");
    }
  }
};

export const showZendeskWidget = () => {
  if ((window as any).zE) {
    (window as any).zE("webWidget", "show");
  } else {
    setTimeout(() => {
      if ((window as any).zE) {
        (window as any).zE("webWidget", "show");
      }
    }, ZENDESK_WARMUP_DELAY_MS);
  }
};
