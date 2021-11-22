export interface SpaceSchema {
  template?: string;
  venueName?: string;
}

export interface PortalSchema extends SpaceSchema {
  roomUrl?: string;
}

export const mustBeMinimum = (fieldName: string, min: number) =>
  `${fieldName} must be at least ${min} characters`;

export const mustBeMaximum = (fieldName: string, max: number) =>
  `${fieldName} must be less than ${max} characters`;
