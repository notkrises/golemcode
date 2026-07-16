import type { BorderCharacters } from "@opentui/core";

// A border where every character is invisible. Useful as a base: spread it,
// then override just the edges you want drawn (see input-bar.tsx).
export const EmptyBorder: BorderCharacters = {
  topLeft: "",
  bottomLeft: "",
  vertical: "",
  topRight: "",
  bottomRight: "",
  horizontal: " ",
  bottomT: "",
  topT: "",
  cross: "",
  leftT: "",
  rightT: "",
};

export const SplitBorderChars: BorderCharacters = {
  ...EmptyBorder,
  vertical: "┃",
};
