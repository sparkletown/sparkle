import { EntityStateMachine } from "@ash.ts/ash";

import { ReplicatedUser } from "store/reducers/AnimateMap";

export class ArtcarComponent {
  constructor(public artcar: ReplicatedUser, public fsm: EntityStateMachine) {}
}
