import React from "react";
import { orderBy } from "firebase/firestore";

import {
  ALWAYS_EMPTY_ARRAY,
  DEFERRED,
  SHOW_EMOJI_IN_REACTION_PAGE,
} from "settings";

import { EmojiReaction, TextReaction, TextReactionType } from "types/reactions";

import { useLiveCollection } from "hooks/fire/useLiveCollection";
import { useWorldAndSpaceByParams } from "hooks/spaces/useWorldAndSpaceByParams";

import { UserList } from "components/molecules/UserList";

import { ReactionList } from "./ReactionList";

import "./ReactionPage.scss";

export const ReactionPage: React.FC = () => {
  const { space, spaceId } = useWorldAndSpaceByParams();

  // @debt this is very similar to the query in src/hooks/reactions.tsx, but that filters by createdAt > now
  const { data } = useLiveCollection<TextReaction | EmojiReaction>({
    path: ["experiences", spaceId || DEFERRED, "reactions"],
    constraints: [orderBy("created_at", "desc")],
  });

  const reactions = SHOW_EMOJI_IN_REACTION_PAGE
    ? data ?? ALWAYS_EMPTY_ARRAY
    : (data ?? ALWAYS_EMPTY_ARRAY).filter(
        (reaction) => reaction.reaction === TextReactionType
      );

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
