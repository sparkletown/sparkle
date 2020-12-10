import { createAsyncThunk } from "@reduxjs/toolkit";
import firebase from "firebase/app";
import { Reaction } from "utils/reactions";

export const ADD_REACTION: string = "ADD_REACTION";

interface AddReactionAction {
  type: typeof ADD_REACTION;
  venueId: string | undefined;
  reaction: Reaction;
}

export const addReaction = createAsyncThunk<void, AddReactionAction>(
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
