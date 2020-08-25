import React from "react";
import CountDown from "components/molecules/CountDown";
import "./PartyTitle.scss";
import { PartyMapVenue } from "types/PartyMapVenue";
import { useSelector } from "hooks/useSelector";

interface PropsType {
  startUtcSeconds: number;
  withCountDown: boolean;
}

const PartyTitle: React.FunctionComponent<PropsType> = ({
  startUtcSeconds,
  withCountDown,
}) => {
  const { venue } = useSelector((state) => ({
    venue: state.firestore.data.currentVenue,
  })) as { venue: PartyMapVenue };

  return (
    <div className="col">
      <h1 className="title">{venue.name}</h1>
      <div className="subtitle-container">
        <img
          className="collective-icon"
          src={venue?.host?.icon}
          alt="Co-Reality collective"
          width="40"
          height="40"
        />
        <div>
          {withCountDown && <CountDown startUtcSeconds={startUtcSeconds} />}
        </div>
      </div>
    </div>
  );
};

export default PartyTitle;
