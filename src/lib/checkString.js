export default function maxLenCrop(str) {
  if (str.length <= 10) return str;

  let newStr = "";
  for (let i = 0; i < 7; i++) newStr += str[i];
  newStr += "...";

  return newStr;
}
