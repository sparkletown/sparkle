import firebase from "firebase/app";

import { AuditoriumSeatedUser } from "types/auditorium";
import { AnyVenue } from "types/venues";

import { WithId, withId } from "utils/id";

export const withIdConverter: firebase.firestore.FirestoreDataConverter<object> = {
  toFirestore: (value: object): firebase.firestore.DocumentData => value,

  fromFirestore: (snapshot: firebase.firestore.QueryDocumentSnapshot) =>
    withId(snapshot.data(), snapshot.id),
};

export const venueConverter: firebase.firestore.FirestoreDataConverter<
  WithId<AnyVenue>
> = {
  toFirestore: (venue: WithId<AnyVenue>): firebase.firestore.DocumentData =>
    venue,

  fromFirestore: (
    snapshot: firebase.firestore.QueryDocumentSnapshot
  ): WithId<AnyVenue> => withId(snapshot.data() as AnyVenue, snapshot.id),
};

export const auditoriumSeatedUserConverter: firebase.firestore.FirestoreDataConverter<
  WithId<AuditoriumSeatedUser>
> = {
  toFirestore: (
    venue: WithId<AuditoriumSeatedUser>
  ): firebase.firestore.DocumentData => venue,

  fromFirestore: (
    snapshot: firebase.firestore.QueryDocumentSnapshot
  ): WithId<AuditoriumSeatedUser> =>
    withId(snapshot.data() as AuditoriumSeatedUser, snapshot.id),
};
