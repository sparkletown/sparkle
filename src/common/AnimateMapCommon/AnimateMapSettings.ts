export const EXTERNAL_WEBGL_CHECK_URL = "https://webglreport.com/?v=2";

export const STRING_SPACE = " ";

export interface PortalBox {
  width_percent: number;
  height_percent: number;
  x_percent: number;
  y_percent: number;
}

export const DEFAULT_PORTAL_BOX: PortalBox = {
  width_percent: 5,
  height_percent: 5,
  x_percent: 50,
  y_percent: 50,
};
Object.freeze(DEFAULT_PORTAL_BOX);
