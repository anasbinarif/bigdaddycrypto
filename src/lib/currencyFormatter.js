export default function addCommas(number) {
  // Check if the input is null or undefined
  // console.log(number);
  if (number == null) {
    return "";
  }

  console.log(number);

  // Convert the number to a string
  let numberString = number.toString();

  // Split the number string by the decimal point
  let parts = numberString.split(".");

  // Add commas to the integer part
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // Join the parts back together with a dot as the decimal separator
  let tempStr = parts.join(".");

  // Replace dots with commas and commas with dots
  tempStr = tempStr.replace(/[.,]/g, function (match) {
    return match === "," ? "." : ",";
  });

  // console.log(tempStr);

  return tempStr;
}
