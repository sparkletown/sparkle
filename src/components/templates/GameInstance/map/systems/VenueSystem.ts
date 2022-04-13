import { Engine, NodeList, System } from "@ash.ts/ash";

import { GameConfig } from "../../../GameConfig";
import { VenueNode } from "../nodes/VenueNode";

export class VenueSystem extends System {
  private venues?: NodeList<VenueNode>;

  addToEngine(engine: Engine) {
    this.venues = engine.getNodeList(VenueNode);
    this.venues?.nodeAdded.add(this.handleVenueAdded);
  }

  removeFromEngine(engine: Engine) {
    this.venues?.nodeAdded.remove(this.handleVenueAdded);
    this.venues = undefined;
  }

  update(time: number) {}

  private handleVenueAdded = (node: VenueNode): void => {
    if (node.venue.model.data.isLive) {
      node.venue.fsm.changeState(node.venue.HALO_ANIMATED);
    } else if (
      node.venue.model.data.countUsers >=
      GameConfig.VENUE_MIN_PEOPLE_COUNT_FOR_HALO
    ) {
      node.venue.fsm.changeState(node.venue.HALO);
    } else {
      node.venue.fsm.changeState(node.venue.WITHOUT_HALO);
    }
  };
}
