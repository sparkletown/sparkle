import { Engine, NodeList, System } from "@ash.ts/ash";

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
    } else if (node.venue.model.data.countUsers > 10) {
      node.venue.fsm.changeState(node.venue.HALO);
    } else {
      node.venue.fsm.changeState(node.venue.WITHOUT_HALO);
    }
  };
}
