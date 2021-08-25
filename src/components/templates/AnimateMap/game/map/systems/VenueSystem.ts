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
    // TODO debug
    const animate = Math.random() < 0.2;
    if (!node.venue.model.data.isEnabled) {
      node.venue.fsm.changeState(node.venue.WITHOUT_HALO);
    } else if (animate) {
      node.venue.fsm.changeState(node.venue.HALO_ANIMATED);
    } else {
      node.venue.fsm.changeState(node.venue.HALO);
    }
  };
}
