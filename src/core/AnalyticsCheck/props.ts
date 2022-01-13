import { UserId } from "types/id";
import { RefiAuthUser } from "types/reactfire";
import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";

import { useProfile } from "hooks/user/useProfile";

type SpaceProps = { space: WithId<AnyVenue> };
export type AnalyticsCheckLoginProps = { user: RefiAuthUser; userId: UserId };
export type AnalyticsCheckProfileProps = AnalyticsCheckLoginProps &
  ReturnType<typeof useProfile>;

export type AnalyticsCheckRequiredProps = SpaceProps &
  AnalyticsCheckLoginProps &
  AnalyticsCheckProfileProps;
export type AnalyticsCheckProps = Partial<AnalyticsCheckRequiredProps>;
