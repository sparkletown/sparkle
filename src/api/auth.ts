import firebase from "firebase/app";

type CheckAccessTypes = {
  venueId: string;
  password?: string;
  email?: string;
  code?: string;
  token?: string;
};

export const checkAccess = async (data: CheckAccessTypes) =>
  await firebase.functions().httpsCallable("access-checkAccess")(data);
