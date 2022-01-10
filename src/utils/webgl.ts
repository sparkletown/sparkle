/**
 *
 * Checks, in the canonical manner, if the browser/OS/drivers supports WebGL2.
 *
 * @see https://stackoverflow.com/questions/54401577/check-if-webgl2-is-supported-and-enabled-in-clients-browser
 *
 *  For a textbook check @see https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/By_example/Detect_WebGL
 *
 */
export const isWebGl2Supported = () =>
  !!document.createElement("canvas").getContext("webgl2");

/**
 *
 * Checks, in alternate manner, if the browser supports WebGL2, but is disabled due to OS/drivers
 *
 * @return true if supported and enabled, false if not supported by browser, null if not by device/OS
 *
 * @see https://stackoverflow.com/questions/54401577/check-if-webgl2-is-supported-and-enabled-in-clients-browser
 *
 * For a textbook check @see https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/By_example/Detect_WebGL
 *
 */
export const isWebGl2Enabled = () =>
  isWebGl2Supported()
    ? true
    : typeof WebGL2RenderingContext === "undefined"
    ? false
    : null;
