import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";

export interface DetailsProps {
  venue?: WithId<AnyVenue>;
}
