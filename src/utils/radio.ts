export const getRadioStationUrl = (stationName: string | boolean) => {
  if (!stationName) {
    return "";
  }

  return `https://w.soundcloud.com/player/?url=${stationName}&amp;start_track=0&amp;single_active=true&amp;show_artwork=false`;
};
