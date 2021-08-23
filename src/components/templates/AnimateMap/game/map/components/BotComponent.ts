import { EntityStateMachine } from "@ash.ts/ash";

import { ReplicatedUser } from "store/reducers/AnimateMap";

export class BotComponent {
  get IDLE(): string {
    return "idle";
  }
  get MOVING(): string {
    return "moving";
  }
  get IMMOBILIZED(): string {
    return "immobilized";
  }

  constructor(
    public data: ReplicatedUser,
    public fsm: EntityStateMachine,
    public realUser = false
  ) {}
}
