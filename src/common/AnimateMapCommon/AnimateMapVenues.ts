import { SpaceId } from "./AnimateMapIds";

export type WorldEvent = {
  name: string;
  startUtcSeconds: number;
  description: string;
  durationMinutes: number;
  host: string;
  id: string;
  orderPriority?: number;
  liveAudience?: number;
  spaceId: SpaceId;
  worldId: string;
};

export type AnyVenue = {};

export type WithVenue<T extends object> = T & { venue: AnyVenue };
