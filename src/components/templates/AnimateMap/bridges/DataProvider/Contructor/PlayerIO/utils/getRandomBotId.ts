import { getRandomInt } from "utils/getRandomInt";

export function getRandomBotId(length: number) {
  const alphabet =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

  let result = "";
  for (let i = 0; i < length; i++) {
    result += alphabet[getRandomInt(alphabet.length - 1)];
  }
  return result;
}
