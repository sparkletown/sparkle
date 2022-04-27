import { AnimateMapUser, AnimateMapUserData } from "common/AnimateMapCommon";

export class DataProviderPlayerModel implements AnimateMapUser {
  public data: AnimateMapUserData = {
    id: "",
    partyName: "",
    messengerId: 0,
    pictureUrl: "",
    dotColor: Math.floor(Math.random() * 16777215),
  };

  public constructor(
    id: string,
    messengerId: number,
    avatarUrlString: string,
    public x: number = 9920 / 2,
    public y: number = 9920 / 2
  ) {
    this.data.id = id;
    this.data.messengerId = messengerId;
    this.data.pictureUrl = avatarUrlString;
  }
}
