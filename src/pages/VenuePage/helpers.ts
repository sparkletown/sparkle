import { Venue } from "types/venues";

export const updateTheme = (venue: Venue) => {
  venue?.config?.theme?.primaryColor &&
    document.documentElement.style.setProperty(
      "--primary-color",
      venue.config.theme.primaryColor
    );

  venue?.config?.theme?.backgroundColor &&
    document.documentElement.style.setProperty(
      "--background-color",
      venue.config.theme.backgroundColor
    );
};
