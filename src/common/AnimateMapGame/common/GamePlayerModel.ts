import { GameUser, GameUserData } from "./GameControls";

export class PlayerModel implements GameUser {
  public data: GameUserData = {
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

export const playerModel = new PlayerModel("", -1, "");
