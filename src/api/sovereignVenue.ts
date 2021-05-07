import firebase from "firebase/app";

import { AnyVenue } from "types/venues";

import { withId, WithId } from "utils/id";

export const getVenueCollectionRef = () =>
  firebase.firestore().collection("venues");

export const getVenueRef = (venueId: string) =>
  getVenueCollectionRef().doc(venueId);

// TODO: return an array of all venueId's we find on the full way up to the sovereignVenue
export const fetchSovereignVenueId = async (
  venueId: string,
  previouslyCheckedVenueIds: readonly string[] = []
): Promise<string> => {
  const venue = await fetchVenue(venueId);

  if (!venue) throw new Error(`The '${venueId}' venue doesn't exist`);

  if (!venue.parentId) return venue.id;

  if (previouslyCheckedVenueIds.includes(venueId))
    throw new Error(
      `Circular reference detected. '${venueId}' has already been checked`
    );

  return fetchSovereignVenueId(venue.parentId, [
    ...previouslyCheckedVenueIds,
    venueId,
  ]);
};

export const fetchVenue = async (
  venueId: string
): Promise<WithId<AnyVenue> | undefined> => {
  const venueDoc = await getVenueRef(venueId).get();

  // TODO: Use proper data validation + firestore model converters to set this type rather than just forcing it with 'as'
  //  see .withConverter(soundConfigConverter) in fetchSoundConfigs in src/api/sounds.ts as an example
  const venue: AnyVenue | undefined = venueDoc.data() as AnyVenue | undefined;

  if (!venue) return undefined;

  return withId(venue, venueId);
};
