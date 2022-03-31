import {
  ExtendedFirebaseInstance,
  ExtendedFirestoreInstance,
} from "react-redux-firebase";
import { utils } from "pixi.js";

export class StorageProvider extends utils.EventEmitter {
  protected storage: ExtendedFirestoreInstance;

  constructor(protected _firebase: ExtendedFirebaseInstance) {
    super();

    this.storage = _firebase.firestore();
  }

  // loadVenue() {
  //   return this._firestore.collection("venues").orderBy("animatemap").get();
  // }
}
