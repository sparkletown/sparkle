import { Entity } from "@ash.ts/ash";

import { addVenueTooltip } from "../map/entities/createVenueEntity";
import { VenueNode } from "../map/nodes/VenueNode";

import Command from "./Command";

export class ShowTooltipClickEnter implements Command {
  private resolve: Function | undefined;

  private static entity: Entity | undefined;
  private timeout = 500;

  constructor(private nodeVenue: VenueNode) {
    console.log("ShowTooltipClickEnter", nodeVenue.venue.model.data.url);
  }

  execute(): Promise<this> {
    return new Promise<this>((resolve) => {
      this.resolve = resolve;
      addVenueTooltip(
        this.nodeVenue.venue.model,
        this.nodeVenue.entity,
        this.nodeVenue.venue.model.data.title,
        "Click Enter to join"
      );
    });
  }

  private complete(): void {
    if (this.resolve) {
      this.resolve(this);
      this.resolve = undefined;
    }
  }
}
