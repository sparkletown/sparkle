import { DEFAULT_PROFILE_IMAGE } from "settings";
import { User } from "types/User";
import * as PIXI from "pixi.js";

export function hitTestRectangle(r1: any, r2: any) {
  if (!r1 || !r2) return;
  //Define the variables we'll need to calculate
  let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

  //hit will determine whether there's a collision
  hit = false;

  //Find the center points of each sprite
  r1.centerX = r1.x + r1.width / 2;
  r1.centerY = r1.y + r1.height / 2;
  r2.centerX = r2.x + r2.width / 2;
  r2.centerY = r2.y + r2.height / 2;

  //Find the half-widths and half-heights of each sprite
  r1.halfWidth = r1.width / 2;
  r1.halfHeight = r1.height / 2;
  r2.halfWidth = r2.width / 2;
  r2.halfHeight = r2.height / 2;

  //Calculate the distance vector between the sprites
  vx = r1.centerX - r2.centerX;
  vy = r1.centerY - r2.centerY;

  //Figure out the combined half-widths and half-heights
  combinedHalfWidths = r1.halfWidth + r2.halfWidth;
  combinedHalfHeights = r1.halfHeight + r2.halfHeight;

  //Check for a collision on the x axis
  if (Math.abs(vx) < combinedHalfWidths) {
    //A collision might be occurring. Check for a collision on the y axis
    if (Math.abs(vy) < combinedHalfHeights) {
      //There's definitely a collision happening
      hit = true;
    } else {
      //There's no collision on the y axis
      hit = false;
    }
  } else {
    //There's no collision on the x axis
    hit = false;
  }

  //`hit` will be either `true` or `false`
  return hit;
}

export const createPlayer = ({
  id,
  x,
  y,
  userProfile,
  onCreated,
  isMe = false,
}: {
  id: string;
  x?: number;
  y?: number;
  userProfile?: User;
  onCreated: (child: PIXI.Sprite) => void;
  isMe?: boolean;
}) => {
  const imgURL = userProfile?.pictureUrl
    ? `https://cors-anywhere.herokuapp.com/${userProfile.pictureUrl}`
    : DEFAULT_PROFILE_IMAGE;
  const texture = PIXI.Texture.from(imgURL);

  const player = new PIXI.Sprite(texture);

  player.name = id;

  player.height = 45;
  player.width = 45;

  player.x = x ?? 10;
  player.y = y ?? 10;

  player.zIndex = 1;

  onCreated(player);

  return player;
};
