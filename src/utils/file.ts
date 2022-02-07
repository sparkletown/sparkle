import firebase from "firebase/compat/app";
import { v4 as uuid } from "uuid";

export const uploadFile = async (path: string, files?: FileList) => {
  const storageRef = firebase.storage().ref();

  if (!files || files.length === 0) return;
  const file = files[0];
  const uploadFileRef = storageRef.child(`${path}/${uuid()}--${file.name}`);

  await uploadFileRef.put(file);
  const downloadUrl: string = await uploadFileRef.getDownloadURL();

  return downloadUrl;
};
