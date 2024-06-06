export default function addCommas(number) {
  let numberString = number.toString();

  let parts = numberString.split(".");

  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  let tempStr = parts.join(".").replace(/[.,]/g, function (match) {
    return match === "," ? "." : ",";
  });

  return tempStr;
}
