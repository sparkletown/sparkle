import { ReplicatedUser, ReplicatedUserData } from "store/reducers/AnimateMap";

class PlayerModel implements ReplicatedUser {
  data: ReplicatedUserData = {
    id: "",
    videoUrlString: "",
    avatarUrlString: "",
    dotColor: Math.floor(Math.random() * 16777215),
    hat: null,
    accessories: null,
    cycle: null,
  };
  x: number = 4960;
  y: number = 4960;
}

const playerModel = new PlayerModel();
export default playerModel;
