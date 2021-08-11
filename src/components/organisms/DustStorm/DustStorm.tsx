import React, { useCallback, useState } from "react";
import { useHistory } from "react-router-dom";
import Bugsnag from "@bugsnag/js";
import firebase from "firebase/app";

import {
  DUST_STORM_TEXT_1,
  DUST_STORM_TEXT_2,
  IFRAME_TEMPLATES,
  ZOOM_URL_TEMPLATES,
} from "settings";

import { OnlineStatsData } from "types/OnlineStatsData";
import { AnyVenue } from "types/venues";

import { getRandomInt } from "utils/getRandomInt";
import { WithId } from "utils/id";
import { FIVE_MINUTES_MS } from "utils/time";

import { useInterval } from "hooks/useInterval";

import "./DustStorm.scss";

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

  // @debt FIVE_MINUTES_MS is deprecated; create needed constant in settings
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
