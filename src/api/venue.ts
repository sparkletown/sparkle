import Bugsnag from "@bugsnag/js";
import firebase from "firebase/app";

import { AnyVenue } from "types/venues";

import { withId, WithId } from "utils/id";

export const getVenueCollectionRef = () =>
  firebase.firestore().collection("venues");

export const getVenueRef = (venueId: string) =>
  getVenueCollectionRef().doc(venueId);

export interface SetVenueLiveStatusProps {
  venueId: string;
  isLive: boolean;
  onError?: (msg: string) => void;
  onFinish?: () => void;
}

export const setVenueLiveStatus = async ({
  venueId,
  isLive,
  onError,
  onFinish,
}: SetVenueLiveStatusProps): Promise<void | firebase.functions.HttpsCallableResult> => {
  const params = {
    isLive,
    venueId,
  };

  return firebase
    .functions()
    .httpsCallable("venue-setVenueLiveStatus")(params)
    .catch((err) => {
      Bugsnag.notify(err, (event) => {
        event.addMetadata("context", {
          location: "api/venue::setVenueLiveStatus",
          venueId,
        });
      });

      if (onError) onError(err);
    })
    .finally(onFinish);
};

export interface FetchSovereignVenueReturn {
  sovereignVenue: WithId<AnyVenue>;
  checkedVenueIds: readonly string[];
}

export const fetchSovereignVenueId = async (
  venueId: string,
  previouslyCheckedVenueIds: readonly string[] = []
): Promise<FetchSovereignVenueReturn> => {
  const venue = await fetchVenue(venueId);

  if (!venue) throw new Error(`The '${venueId}' venue doesn't exist`);

  if (!venue.parentId)
    return {
      sovereignVenue: venue,
      checkedVenueIds: previouslyCheckedVenueIds,
    };

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

export const fetchAllChildVenues = async (
  venueId: string
): Promise<WithId<AnyVenue>[]> => {
  const childVenuesSnapshot = await getVenueCollectionRef()
    .where("parentId", "==", venueId)
    // .withConverter()
    .get();

  if (childVenuesSnapshot.empty) return [];

  // TODO: Use proper data validation + firestore model converters to set this type rather than just forcing it with 'as'
  //  see .withConverter(soundConfigConverter) in fetchSoundConfigs in src/api/sounds.ts as an example
  const childVenues = childVenuesSnapshot.docs
    .filter((docSnapshot) => docSnapshot.exists)
    .map((docSnapshot) =>
      withId(docSnapshot.data() as AnyVenue, docSnapshot.id)
    );

  const grandChildrenVenues = await Promise.all(
    childVenues.map((childVenue) => fetchAllChildVenues(childVenue.id))
  );

  // TODO: Use proper data validation + firestore model converters to set this type rather than just forcing it with 'as'
  //  see .withConverter(soundConfigConverter) in fetchSoundConfigs in src/api/sounds.ts as an example
  return [...childVenues, ...grandChildrenVenues.flat()];
};

export const fetchRelatedVenues = async (
  venueId: string
): Promise<WithId<AnyVenue>[]> => {
  const { sovereignVenue } = await fetchSovereignVenueId(venueId);

  const childrenVenues = await fetchAllChildVenues(sovereignVenue.id);

  return [sovereignVenue, ...childrenVenues];
};
