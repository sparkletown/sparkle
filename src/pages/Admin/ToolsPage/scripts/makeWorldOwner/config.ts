import { SelfServeScript } from "../../types";

import { AddWorldOwnerOutput } from "./AddWorldOwnerOutput";

export const AddWorldOwnerScript: SelfServeScript = {
  name: "Add world owner",
  description: "Adds world owner by email",
  functionLocation: "user-makeUserWorldOwner",
  arguments: [
    {
      name: "userEmail",
      title: "User Email",
      isRequired: false,
    },
  ],
  outputComponent: AddWorldOwnerOutput,
};
