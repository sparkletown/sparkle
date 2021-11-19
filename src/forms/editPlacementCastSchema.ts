import * as Yup from "yup";

import { PlacementInput } from "api/admin";

// @debt I'm pretty sure every one of these .from that have the same fromKey / toKey are redundant noops and should be removed
export const editPlacementCastSchema = Yup.object()
  .shape<Partial<PlacementInput>>({})

  .from("placement.addressText", "addressText")
  .from("placement.notes", "notes")
  .required();
