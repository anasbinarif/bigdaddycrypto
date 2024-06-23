import { PureLightTheme } from "./schemes/PureLightTheme";
import { DarkGreyTheme } from "./schemes/DarkGreyTheme";

const themeMap = {
  PureLightTheme,
  DarkGreyTheme,
};

export function themeCreator(theme) {
  return themeMap[theme];
}
