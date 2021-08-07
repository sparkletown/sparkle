import {
  ExtendedFirebaseInstance,
  ExtendedFirestoreInstance,
} from "react-redux-firebase";
import { utils } from "pixi.js";

export class FirebaseDataProvider extends utils.EventEmitter {
  protected _firestore: ExtendedFirestoreInstance;

  constructor(protected _firebase: ExtendedFirebaseInstance) {
    super();

    this._firestore = _firebase.firestore();
  }

  loadVenue() {
    return this._firestore.collection("venues").orderBy("animatemap").get();
  }
}
