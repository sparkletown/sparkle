import {
  AnimateMapEntityType,
  ReplicatedUser,
  ReplicatedUserData,
} from "store/reducers/AnimateMap";

class PlayerModel implements ReplicatedUser {
  data: ReplicatedUserData = {
    videoUrlString: "",
    avatarUrlString: "",
    dotColor: Math.floor(Math.random() * 16777215),
    hat: null,
    accessories: null,
    cycle: null,
  };
  id: string = "";
  type: AnimateMapEntityType = AnimateMapEntityType.userWithControls;
  x: number = 4960;
  y: number = 4960;
}

const playerModel = new PlayerModel();
export default playerModel;
