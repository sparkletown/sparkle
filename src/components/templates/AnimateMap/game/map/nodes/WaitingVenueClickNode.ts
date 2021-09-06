import { defineNode } from "@ash.ts/ash";

import { WaitingVenueClickComponent } from "../components/WaitingVenueClickComponent";

export class WaitingVenueClickNode extends defineNode({
  venue: WaitingVenueClickComponent,
}) {}
