import firebase from "firebase/app";
import { uuid } from "uuidv4";

export const uploadFile = async (path: string, files?: FileList) => {
  const storageRef = firebase.storage().ref();

  if (!files || files.length === 0) return;
  const file = files[0];
  const uploadFileRef = storageRef.child(`${path}/${uuid()}--${file.name}`);

  await uploadFileRef.put(file);
  const downloadUrl: string = await uploadFileRef.getDownloadURL();

  return downloadUrl;
};
