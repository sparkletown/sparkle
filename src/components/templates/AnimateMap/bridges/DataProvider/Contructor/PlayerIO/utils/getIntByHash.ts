function convertStringToInt(hash: string) {
  const alphabet =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const radix = alphabet.length;

  let result = 0;
  for (let i = 0, pow = hash.length - 1; i < hash.length; i++, pow--) {
    result += alphabet.indexOf(hash[i]) * Math.pow(radix, pow);
  }
  return result;
}

export function getIntByHash(hash: string, complexity = 30) {
  const max = Math.floor(256 / complexity);

  let result = 0;
  let i = 0;
  while (i < hash.length) {
    let str = "";
    for (let j = 0; j < max && i < hash.length; j++, i++) {
      str += hash[i];
    }
    result += convertStringToInt(str);
  }
  return result;
}
