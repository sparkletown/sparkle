import { EntityStateMachine } from "@ash.ts/ash";

import { ReplicatedUser } from "store/reducers/AnimateMap";

export class BotComponent {
  constructor(
    public data: ReplicatedUser,
    public fsm: EntityStateMachine,
    public realUser = false
  ) {}
}
