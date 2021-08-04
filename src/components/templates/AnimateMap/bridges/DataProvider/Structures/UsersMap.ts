type item = string | Set<string>;

export class UsersMap {
  private _mapById = new Map<number, item>();
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

  public getId(key: number) {
    return this._mapById.get(key);
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
    //TODO: add implementation
  }

  private _loadMap() {
    //TODO: add implementation
  }

  remove(sessionId: number) {
    this._mapById.delete(sessionId);
  }
}
