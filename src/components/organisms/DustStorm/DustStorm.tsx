import Bugsnag from "@bugsnag/js";
import React, { useState, useCallback } from "react";

import { AnyVenue } from "types/venues";

import "./DustStorm.scss";
import { WithId } from "utils/id";
import firebase from "firebase/app";
import { useHistory } from "react-router-dom";
import { OnlineStatsData } from "types/OnlineStatsData";
import { useInterval } from "hooks/useInterval";
import { getRandomInt } from "utils/getRandomInt";
import {
  ZOOM_URL_TEMPLATES,
  IFRAME_TEMPLATES,
  DUST_STORM_TEXT_1,
  DUST_STORM_TEXT_2,
} from "settings";
import { FIVE_MINUTES_MS } from "utils/time";

interface PotLuckProps {
  openVenues?: Array<WithId<AnyVenue>>;
  afterSelect: () => void;
}

const PotLuck: React.FC<PotLuckProps> = ({ openVenues, afterSelect }) => {
  const history = useHistory();
  const goToRandomVenue = useCallback(() => {
    const ExperiencesOrArtpieces = openVenues?.filter(
      (venue) =>
        IFRAME_TEMPLATES.includes(venue.template) ||
        ZOOM_URL_TEMPLATES.includes(venue.template)
    );

    if (!ExperiencesOrArtpieces) return;

    const randomVenue =
      ExperiencesOrArtpieces[getRandomInt(ExperiencesOrArtpieces?.length - 1)];
    afterSelect();

    if (IFRAME_TEMPLATES.includes(randomVenue?.template))
      history.push(`/in/${randomVenue.id}`);
    if (ZOOM_URL_TEMPLATES.includes(randomVenue?.template))
      window.open(`${randomVenue.zoomUrl}`);
  }, [openVenues, afterSelect, history]);
  if (!openVenues) {
    return <></>;
  }
  return (
    <button onClick={goToRandomVenue} className="btn btn-primary">
      Join the closest venue
    </button>
  );
};

export const DustStorm = () => {
  const [openVenues, setOpenVenues] = useState<OnlineStatsData["openVenues"]>(
    []
  );

  useInterval(() => {
    firebase
      .functions()
      .httpsCallable("stats-getOnlineStats")()
      .then((result) => {
        const { openVenues } = result.data as OnlineStatsData;

        setOpenVenues(openVenues);
      })
      .catch(Bugsnag.notify);
  }, FIVE_MINUTES_MS);

  return (
    <div className="duststorm-container show">
      <div className="modal-content">
        <h3 className="italic">Dust storm alert!</h3>
        <p>{DUST_STORM_TEXT_1}</p>
        <p>{DUST_STORM_TEXT_2}</p>
        <PotLuck
          openVenues={openVenues.map((ov) => ov.venue)}
          // Force popover to close
          afterSelect={() => document.body.click()}
        />
      </div>
    </div>
  );
};
