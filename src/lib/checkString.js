export default function maxLenCrop(str) {
  if (str.length <= 12) return str;

  let newStr = "";
  for (let i = 0; i < 9; i++) newStr += str[i];
  newStr += "...";

  return newStr;
}
