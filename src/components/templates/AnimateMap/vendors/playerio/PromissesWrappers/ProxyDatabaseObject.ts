import { databaseobject } from "../PlayerIO";

export class ProxyDatabaseObject {
  constructor(public originDatabaseObject: databaseobject) {}

  get existsInDatabase() {
    return this.originDatabaseObject.existsInDatabase;
  }

  get key() {
    return this.originDatabaseObject.key;
  }

  get table() {
    return this.originDatabaseObject.table;
  }

  async save(useOptimisticLock?: boolean, fullOverwrite?: boolean) {
    return new Promise<void>((resolve, reject) => {
      this.originDatabaseObject.save(
        useOptimisticLock,
        fullOverwrite,
        resolve,
        reject
      );
    });
  }
}
