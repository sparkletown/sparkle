import React, { useState, useCallback, useEffect } from "react";
import "./DustStorm.scss";
import { WithId } from "utils/id";
import { AnyVenue } from "types/Firestore";
import { User } from "types/User";
import { EventData } from "types/EventData";
import firebase from "firebase";
import { useHistory } from "react-router-dom";

interface getOnlineStatsData {
  onlineUsers: Array<WithId<User>>;
  openVenues: Array<{
    venue: WithId<AnyVenue>;
    currentEvents: EventData;
  }>;
}

const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * Math.floor(max + 1));
};

interface PoLuckButtonProps {
  openVenues?: Array<WithId<AnyVenue>>;
  afterSelect: () => void;
}

const PotLuckButton: React.FC<PoLuckButtonProps> = ({
  openVenues,
  afterSelect,
}) => {
  const history = useHistory();
  const goToRandomVenue = useCallback(() => {
    if (!openVenues) return;
    const randomVenue = openVenues[getRandomInt(openVenues?.length - 1)];
    afterSelect();
    console.log(randomVenue.id);
    history.push(`/in/${randomVenue.id}`);
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
  const [openVenues, setOpenVenues] = useState<
    getOnlineStatsData["openVenues"]
  >([]);

  useEffect(() => {
    const getOnlineStats = firebase
      .functions()
      .httpsCallable("stats-getOnlineStats");
    const updateStats = () => {
      getOnlineStats()
        .then((result) => {
          const { openVenues } = result.data as getOnlineStatsData;
          setOpenVenues(openVenues);
        })
        .catch(() => {}); // REVISIT: consider a bug report tool
    };
    updateStats();
    const id = setInterval(() => {
      updateStats();
    }, 60 * 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={`duststorm-container show`}>
      <div className="modal-content">
        <h3 className="italic">Dust Storm ahead!</h3>
        <p>
          All navigation are impossible! You have one option and one option
          only: to head to the nearest space and hang out there for the duration
          of the sand storm!
        </p>
        <PotLuckButton
          openVenues={openVenues.map((ov) => ov.venue)}
          // Force popover to close
          afterSelect={() => document.body.click()}
        />
      </div>
    </div>
  );
};
