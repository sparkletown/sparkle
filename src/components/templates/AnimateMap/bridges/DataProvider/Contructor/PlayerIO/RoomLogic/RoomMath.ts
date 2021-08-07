const D = 3; // dimension in line
const DD = 9; // dimension in square
const MAX_DEPTH = 9;
const W = 39366;
const H = 39366;

export class RoomMath {
  /**
   * In theory, the algorithm can work with higher partitioning pow if the index search algorithm (findIndexBasedOnThree) is unified.
   */
  protected static getFramePoint(id: number) {
    if (id === 0)
      return [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ];

    let relativeId = id;
    let depth = 0;
    let dif = Math.pow(DD, depth);

    while (depth <= MAX_DEPTH && relativeId - dif >= 0) {
      relativeId -= dif;
      depth++;
      dif = Math.pow(DD, depth);
    }

    const width = W / Math.pow(D, depth);
    const height = H / Math.pow(D, depth);

    let id_baseD = relativeId.toString(D);
    let parentalForColumn_baseD = "1";
    for (let j = 2, i = id_baseD.length - 2; i >= 0; i--, j++) {
      parentalForColumn_baseD =
        (j % 2 !== 0 ? 0 : id_baseD[i]) + parentalForColumn_baseD;
    }
    parentalForColumn_baseD = parseInt(parentalForColumn_baseD, D).toString(D);
    const length = parentalForColumn_baseD.length;
    const parentalForColumn = parseInt(parentalForColumn_baseD, D);
    const min = Math.floor(Math.pow(D, length / 2 - 1) + 1);
    const max = Math.floor(Math.pow(D, length / 2));
    const column: number = RoomMath.findIndexBasedOnThree(
      parentalForColumn_baseD,
      /*D,*/ min,
      max
    );

    const offset = relativeId - parentalForColumn + 1;
    const parentalForRow_baseD = offset.toString(D);
    const length2 = parentalForRow_baseD.length;
    const min2 = Math.floor(Math.pow(D, (length2 - 1) / 2) + 1);
    const max2 = Math.floor(Math.pow(D, (length2 - 1) / 2 + 1));
    const row = RoomMath.findIndexBasedOnThree(
      parentalForRow_baseD,
      /*D,*/ min2,
      max2
    );

    const x1 = row * width;
    const x2 = (row + 1) * width;
    const y1 = column * height;
    const y2 = (column + 1) * height;

    return [
      [x1, y1],
      [x1, y2],
      [x2, y1],
      [x2, y2],
    ];
  }

  //@ts-ignore //TODO: refactor recursion to cycle
  protected static findIndexBasedOnThree(
    parental: string,
    min: number,
    max: number,
    i = 0
  ) {
    if (parental === "0") return 0;

    if (min === max) return min - 1; //find!
    if (parental.length < i) throw new Error("WTF2");

    const p = parental[i];

    //exception case;
    if (i === 0) {
      if (p === "1") {
        max = max - (max - min + 1) / 2;
        return RoomMath.findIndexBasedOnThree(parental, min, max, i + 2);
      } else if (p === "2") {
        min = min + (max - min + 1) / 2;
        return RoomMath.findIndexBasedOnThree(parental, min, max, i + 2);
      } else throw new Error("WTF");
    }

    //usual case
    switch (p) {
      case "0":
        max = max - (2 * (max - min + 1)) / D;
        break;
      case "1":
        const oldMin = min;
        min = min + (max - min + 1) / 3;
        max = max - (max - oldMin + 1) / D;
        break;
      case "2":
        min = min + (2 * (max - min + 1)) / D;
        break;
    }
    return RoomMath.findIndexBasedOnThree(parental, min, max, i + 2);
  }
}
