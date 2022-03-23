import Bugsnag from "@bugsnag/js";

import { AnimateMapVenue } from "types/venues";

import { WithId } from "utils/id";

export type BugsnagType = {
  appError: Error;
  location: string;
  space: WithId<AnimateMapVenue>;
};

export const bugsnagNotify = (args: BugsnagType) => {
  Bugsnag.notify(args.appError, (event) => {
    event.addMetadata("context", {
      location: args.location,
      errorInitializing: args.appError,
      space: args.space,
    });
  });
};
