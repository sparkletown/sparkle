import firebase from "firebase/app";

export const setVenueLiveStatus = async (
  venueId: string,
  isLive: boolean
): Promise<void> => {
  const params = {
    isLive,
    venueId,
  };

  console.log("setting venue live");

  await firebase.functions().httpsCallable("venue-setVenueLiveStatus")(params);
};
