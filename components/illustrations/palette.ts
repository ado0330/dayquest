/** Illustration palette. Mirrors the CSS tokens in app/globals.css. */
export const P = {
  ink: "#233047",
  white: "#ffffff",
  cream: "#fff8ec",
  shadow: "rgba(35,48,71,0.12)",
  shine: "rgba(255,255,255,0.55)",

  sky: "#5ab4f0",
  skyLight: "#bfe3fb",
  skyDark: "#2f86c9",
  mint: "#63d3a6",
  mintLight: "#c3f0dc",
  mintDark: "#2fa77a",
  coral: "#ff8a73",
  coralLight: "#ffc7ba",
  coralDark: "#e5604a",
  sun: "#ffcb45",
  sunLight: "#ffe69a",
  sunDark: "#f0a92a",
  lilac: "#a994f5",
  lilacLight: "#d9cfff",
  lilacDark: "#7e66e0",
  night: "#5a5fc0",
  nightDark: "#3a3e8c",

  wood: "#e0a96d",
  woodDark: "#b97d45",
  grey: "#d3dae6",
  greyDark: "#98a3b8",
  skin: "#d99e76",
  skinDark: "#b97e58",
} as const;

/** Shared outline style: every object uses the same ink stroke. */
export const line = {
  stroke: P.ink,
  strokeWidth: 3.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export const thin = { ...line, strokeWidth: 2.5 } as const;
