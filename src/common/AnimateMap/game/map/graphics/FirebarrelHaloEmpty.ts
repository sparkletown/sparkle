import { Firebarrel } from "./Firebarrel";

export class FirebarrelHaloEmpty {
  constructor(protected view: Firebarrel) {
    if (view.halo && view.halo.parent) {
      view.halo.parent.removeChild(view.halo);
    }
  }
}
