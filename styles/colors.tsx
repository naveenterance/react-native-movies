export interface ThemeColors {
  orange: string;
  blue: string;
  gray: string;
  textInput: string;
  text: string;
  white: string;
  red: string;
  green: string;
  charcoal: string;
  imdb: string;
  rotten: string;
}

export interface Theme {
  light: ThemeColors;
  dark: ThemeColors;
}

export const theme: Theme = {
  light: {
    orange: "#E55604",
    blue: "#26577C",
    gray: "#b4b0a5",
    textInput: "#718096",
    text: "#ff5733",
    white: "#D1D5DB",
    red: "#ff3b30",
    green: "#008000",
    charcoal: "#1B1212",
    imdb: "#f3ce13",
    rotten: "#a94242",
  },
  dark: {
    orange: "#E55604",
    blue: "#26577C",
    gray: "#4c4c4c",
    textInput: "#718096",
    text: "#33ff3c",
    white: "#000000",
    red: "#ff3b30",
    green: "#008000",
    charcoal: "#b4b0a5",
    imdb: "#f3ce13",
    rotten: "#a94242",
  },
};
