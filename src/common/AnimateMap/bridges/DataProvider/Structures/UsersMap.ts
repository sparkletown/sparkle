import { ReplicatedUser } from "common/AnimateMapStore/reducers";

type item = string | Set<string>;
type itemU = ReplicatedUser | ReplicatedUser[];

export class UsersMap {
  private _mapById = new Map<number, item>();
  private _mapUsersById = new Map<number, itemU>();
  private _hasCollision = false;

  constructor() {
    this._loadMap();
  }

  public addId(...ids: string[]) {
    ids.forEach((id) => this._addLogicTree(id));
    this._saveMap();
  }

  public add(key: number, id: string) {
    const result = this._addLogicTree(id, key);
    this._saveMap();
    return result;
  }

  public addReplicatedUser(user: ReplicatedUser) {
    const result = this._addReplicatedUserLogicTree(user);
    this._saveMap();
    return result;
  }

  private _addReplicatedUserLogicTree(user: ReplicatedUser): boolean {
    // eslint-disable-next-line no-debugger
    // debugger;
    const key = user.data.messengerId;
    const id = user.data.id;
    // if (!key) key = this._idToNumber(id);

    if (!this._mapUsersById.has(key)) {
      // just add
      this._mapUsersById.set(key, user);
      return true;
    } else {
      // need checking
      const value = this._mapUsersById.get(key);
      if (Array.isArray(value)) {
        // set already exist
        if (value.find((i) => i.data.id === id)) return false;

        value.push(user);

        return true;
      } else {
        // just string
        if (value && id !== value.data.id) {
          //collision detected
          console.warn("UsersMap COLLISION detected!");
          this._hasCollision = true;
          this._mapUsersById.set(key, [user]);
          return true;
        }
        //update
        this._mapUsersById.set(key, user);
        return false;
      }
    }
  }

  public getId(key: number) {
    return this._mapById.get(key);
  }

  public getUser(key: number) {
    return this._mapUsersById.get(key);
  }

  private _addLogicTree(id: string, key?: number): boolean {
    if (!key) key = this._idToNumber(id);

    if (!this._mapById.has(key)) {
      // just add
      this._mapById.set(key, id);
      return true;
    } else {
      // need checking
      const value = this._mapById.get(key);
      if (typeof value !== "string") {
        // set already exist
        if (this._mapById.has(key)) return false;

        (this._mapById.get(key) as Set<string>).add(id);
        return true;
      } else {
        // just string
        if (id !== value) {
          //collision detected
          console.warn("UsersMap COLLISION detected!");
          this._hasCollision = true;
          this._mapById.set(key, new Set([id, value]));
          return true;
        }
        return false;
      }
    }
  }

  private _idToNumber(id: string) {
    return Number.parseInt(id, 36);
  }

  private _saveMap() {
    // console.log(this._mapUsersById);
    //TODO: add implementation
  }

  private _loadMap() {
    //TODO: add implementation
  }

  remove(sessionId: number) {
    this._mapById.delete(sessionId);
  }
}
