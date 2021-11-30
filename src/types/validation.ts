export interface SpaceSchema {
  template?: string;
  venueName?: string;
}

export interface PortalSchema extends SpaceSchema {
  roomUrl?: string;
}
