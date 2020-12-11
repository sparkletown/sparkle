import { createAsyncThunk } from "@reduxjs/toolkit";
import firebase from "firebase/app";
import { Reaction } from "utils/reactions";

export const ADD_REACTION: string = "ADD_REACTION";

interface AddReactionFields {
  venueId: string | undefined;
  reaction: Reaction;
}
interface AddReactionAction extends AddReactionFields {
  type: typeof ADD_REACTION;
}

export const addReaction = createAsyncThunk<void, AddReactionFields>(
  ADD_REACTION,
  async ({ venueId, reaction }) => {
    if (!venueId) return;

    await firebase
      .firestore()
      .collection(`experiences/${venueId}/reactions`)
      .add(reaction);
  }
);

export type ReactionActions = AddReactionAction;
