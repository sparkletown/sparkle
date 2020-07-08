import { Venue } from "./VenuePage";

export const updateTheme = (venue: Venue) => {
  venue.theme.primaryColor &&
    document.documentElement.style.setProperty(
      "--primary-color",
      venue.theme.primaryColor
    );

  venue.theme.backgroundColor &&
    document.documentElement.style.setProperty(
      "--background-color",
      venue.theme.backgroundColor
    );
};
