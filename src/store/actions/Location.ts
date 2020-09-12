export const UPDATE_LOCATION = "UPDATE_LOCATION";

interface UpdateLocationAction {
  type: typeof UPDATE_LOCATION;
  x: number;
  y: number;
}

export type LocationActions = UpdateLocationAction;
