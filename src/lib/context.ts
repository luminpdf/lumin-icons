import { createContext } from "react";
import type { IconProps } from "./types";

export const IconContext = createContext<IconProps>({
  color: "currentColor",
  size: "1em",
  weight: "regular",
  mirrored: false,
  viewBox: "0 0 256 256",
});
