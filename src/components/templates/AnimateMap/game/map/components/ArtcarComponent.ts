import { EntityStateMachine } from "@ash.ts/ash";

import { ReplicatedArtcar } from "../../../../GameInstanceCommonInterfaces";

export class ArtcarComponent {
  constructor(
    public artcar: ReplicatedArtcar,
    public fsm: EntityStateMachine
  ) { }
}
