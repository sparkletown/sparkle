import { GridSeatedUser } from "types/User";

export type TalkShowPath = {
  venueId: string;
};

export type TalkShowSeatedUser = GridSeatedUser & {
  path: TalkShowPath;
};
