import firebase from "firebase/compat/app";
import { utils } from "pixi.js";

export class StorageProvider extends utils.EventEmitter {
  protected _firestore: firebase.firestore.Firestore;

  constructor(protected _firebase: typeof firebase) {
    super();

    this._firestore = _firebase.firestore();
  }

  // loadVenue() {
  //   return this._firestore.collection("venues").orderBy("animatemap").get();
  // }
}
