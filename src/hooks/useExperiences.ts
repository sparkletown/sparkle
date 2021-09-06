import { ValidStoreAsKeys } from "types/Firestore";

import { useFirestoreConnect } from "./useFirestoreConnect";

export const useExperiences = (venueName?: string) => {
  // @debt refactor this + related code so as not to rely on using a shadowed 'storeAs' key
  //   this should be something like `storeAs: "currentVenueExperiences"` or similar
  useFirestoreConnect(
    venueName
      ? {
          collection: "experiences",
          doc: venueName,
          storeAs: "experience" as ValidStoreAsKeys, // @debt super hacky, but we're consciously subverting our helper protections
        }
      : undefined
  );
};
