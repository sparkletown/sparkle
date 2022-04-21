import { EntityStateMachine } from "@ash.ts/ash";

import { GameArtcar } from "../../common";

export class ArtcarComponent {
  constructor(public artcar: GameArtcar, public fsm: EntityStateMachine) {}
}
