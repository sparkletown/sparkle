import { bigDB } from "../PlayerIO";

import { ProxyDatabaseObject } from "./ProxyDatabaseObject";

export class ProxyBigDB {
  constructor(public originBigDB: bigDB) {}

  async loadMyPlayerObject() {
    return new Promise<ProxyDatabaseObject>((resolve, reject) => {
      this.originBigDB.loadMyPlayerObject(
        (dbObj) => resolve(new ProxyDatabaseObject(dbObj)),
        reject
      );
    });
  }
}
