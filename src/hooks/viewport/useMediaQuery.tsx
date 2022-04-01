import { useCallback, useEffect, useState } from "react";

type MediaType = "isMobile" | "isTablet" | "isLaptop" | "isLaptopSmall";

const mediaBreakpoints: Record<MediaType, string> = {
  isMobile: "(max-width: 320px)",
  isTablet: "(max-width: 767px)",
  isLaptopSmall: "(max-width: 960px)",
  isLaptop: "(max-width: 1024px)",
};

export const useMediaQuery = () => {
  const getMatches = (): Record<MediaType, boolean> => {
    const matches: Record<string, boolean> = {
      isMobile: false,
      isTablet: false,
      isLaptop: false,
      isLaptopSmall: false,
    };

    Object.entries(mediaBreakpoints).map(
      ([key, label]) => (matches[key] = window.matchMedia(label).matches)
    );

    return matches;
  };

  const [matches, setMatches] = useState<Record<string, boolean>>(getMatches());

  const handleChange = useCallback(() => {
    setMatches(getMatches());
  }, []);

  useEffect(() => {
    const matchMedia = Object.entries(mediaBreakpoints).map(([, label]) =>
      window.matchMedia(label)
    );

    // Triggered at the first client-side load and if query changes
    handleChange();

    // Listen matchMedia
    matchMedia.map((el) => el.addEventListener("change", handleChange));

    return () => {
      matchMedia.map((el) => el.removeEventListener("change", handleChange));
    };
  }, [handleChange]);

  return matches;
};
