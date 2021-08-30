import { Engine, NodeList, System } from "@ash.ts/ash";

import { FirebarrelNode } from "../nodes/FirebarrelNode";

export class FirebarrelSystem extends System {
  private firebarrels?: NodeList<FirebarrelNode>;

  addToEngine(engine: Engine) {
    this.firebarrels = engine.getNodeList(FirebarrelNode);
    this.firebarrels?.nodeAdded.add(this.handleFirebarrelAdded);
  }

  removeFromEngine(engine: Engine) {
    this.firebarrels?.nodeAdded.remove(this.handleFirebarrelAdded);
    this.firebarrels = undefined;
  }

  update(time: number) {}

  private handleFirebarrelAdded = (node: FirebarrelNode): void => {
    // TODO update halo status
    // const usersCount
    // if (usersCount) {
    //   node.firebarrel.fsm.changeState(node.firebarrel.HALO_ANIMATED);
    // } else {
    //   node.firebarrel.fsm.changeState(node.firebarrel.HALO);
    // }
  };
}
