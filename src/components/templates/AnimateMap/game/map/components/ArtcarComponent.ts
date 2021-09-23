import { EntityStateMachine } from "@ash.ts/ash";

import { ReplicatedArtcar } from "store/reducers/AnimateMap";

export class ArtcarComponent {
  constructor(
    public artcar: ReplicatedArtcar,
    public fsm: EntityStateMachine
  ) {}
}
