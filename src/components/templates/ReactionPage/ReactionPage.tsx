import React from "react";

import { ALWAYS_EMPTY_ARRAY, SHOW_EMOJI_IN_REACTION_PAGE } from "settings";

import { messagesToTheBandSelector, reactionsSelector } from "utils/selectors";

import { useSpaceBySlug } from "hooks/spaces/useSpaceBySlug";
import { useFirestoreConnect } from "hooks/useFirestoreConnect";
import { useSelector } from "hooks/useSelector";
import { useSpaceParams } from "hooks/useSpaceParams";

import { UserList } from "components/molecules/UserList";

import { ReactionList } from "./ReactionList";

import "./ReactionPage.scss";

const wantedReactionsSelector = SHOW_EMOJI_IN_REACTION_PAGE
  ? reactionsSelector
  : messagesToTheBandSelector;

// @debt pass venue through the props
export const ReactionPage: React.FC = () => {
  const spaceSlug = useSpaceParams();
  const { space, spaceId } = useSpaceBySlug(spaceSlug);

  // @debt this is very similar to the query in src/hooks/reactions.tsx, but that filters by createdAt > now
  useFirestoreConnect(
    spaceId
      ? {
          collection: "experiences",
          doc: spaceId,
          subcollections: [{ collection: "reactions" }],
          orderBy: ["created_at", "desc"],
          storeAs: "reactions",
        }
      : undefined
  );
  const reactions = useSelector(wantedReactionsSelector) ?? [];

  return (
    <div className="reaction-page-container">
      <h1 className="title">Audience Reactions</h1>

      <div className="row">
        <div className="col-8">
          <ReactionList reactions={reactions} chatMessages={[]} />
        </div>

        <div className="col-4">
          <UserList
            usersSample={space?.recentUsersSample ?? ALWAYS_EMPTY_ARRAY}
            userCount={space?.recentUserCount ?? 0}
            showEvenWhenNoUsers
          />
        </div>
      </div>
    </div>
  );
};
