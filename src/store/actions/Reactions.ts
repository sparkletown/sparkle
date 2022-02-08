import { createAsyncThunk } from "@reduxjs/toolkit";
import firebase from "firebase/compat/app";

import { Reaction } from "types/reactions";

export const ADD_REACTION: string = "ADD_REACTION";

interface AddReactionFields {
  venueId: string | undefined;
  reaction: Reaction;
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
