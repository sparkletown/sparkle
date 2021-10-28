import logoOutline from "assets/loading/logo-outline.svg";

import "scss/initial.scss";

const asyncLoadImage = (path: string, cb: () => void) => {
  const asyncImage = new Image();
  asyncImage.onload = cb;
  asyncImage.src = path;
};

const getEl = (id: string) => document.getElementById(id);

const fade = (el: HTMLElement, direction: string, duration: string) => {
  el.style.transition = `opacity ${duration} ease`;
  if (direction === "in") {
    el.style.opacity = "1";
  } else {
    el.style.opacity = "0";
  }

  //el.style.animation = `loading-fade${direction} ${duration} forwards`;
};

let fadeInTimer: number | undefined;

document.addEventListener("DOMContentLoaded", () => {
  document.body.className = "loading";
  document.documentElement.className = "loading";

  const loadingOverlayEl = getEl("loading-overlay");

  // Only display the loading overlay after a short wait, otherwise we get
  // janky effects when loading from cache or on fast connections.
  fadeInTimer = window.setTimeout(() => {
    if (loadingOverlayEl) {
      fade(loadingOverlayEl, "in", "2s");
    }

    asyncLoadImage(logoOutline, () => {
      const logoEl = getEl("loading-logo");
      if (logoEl) {
        logoEl.style.backgroundImage = `url(${logoOutline})`;
        fade(logoEl, "in", "2s");
      }
    });

    const visibleEl = getEl("loading-text-a");
    const invisibleEl = getEl("loading-text-b");

    if (visibleEl && invisibleEl) {
      // The loading text uses invisible text to ensure that spacing is kept
      // consistent and the words don't bounce around.
      let i = 0;
      window.setInterval(() => {
        i += 1;

        const maxPeriods = 3;
        const numVisiblePeriods = i % (maxPeriods + 1);
        visibleEl.innerText = "Loading " + ".".repeat(numVisiblePeriods);
        invisibleEl.innerText = ".".repeat(maxPeriods - numVisiblePeriods);
      }, 500);
    }

    // Wipe the fadeInTimer so that we know if we've displayed the
    // loading animation.
    fadeInTimer = undefined;
  }, 1000);

  // Now load everything else
  import("./main").then(() => {
    document.body.className = "";
    const rootEl = getEl("root");
    if (!rootEl) {
      return;
    }

    if (fadeInTimer) {
      window.clearTimeout(fadeInTimer);

      // We've not triggered loading animations so display the app straight away
      rootEl.style.opacity = "1";
    } else {
      if (loadingOverlayEl) {
        fade(loadingOverlayEl, "out", "1s");
      }
      window.setTimeout(() => {
        fade(rootEl, "in", "0.5s");
      }, 500);
    }
  });
});
