import React from "react";
import CountDown from "components/molecules/CountDown";
import "./PartyTitle.scss";
import { useSelector } from "react-redux";
import { PartyMapVenue } from "../../types";

interface PropsType {
  startUtcSeconds: number;
  withCountDown: boolean;
}

const PartyTitle: React.FunctionComponent<PropsType> = ({
  startUtcSeconds,
  withCountDown,
}) => {
  const { venue } = useSelector((state: any) => ({
    venue: state.firestore.data.currentVenue,
  })) as { venue: PartyMapVenue };

  return (
    <div className="col">
      <h1 className="title">{venue.name}</h1>
      <div className="subtitle-container">
        <img
          className="collective-icon"
          src={venue.host.icon}
          alt="Co-Reality collective"
          width="20"
          height="20"
        />
        <div>
          Hosted by <a href={venue.host.url}>{venue.host.name}</a>{" "}
          {withCountDown && <CountDown startUtcSeconds={startUtcSeconds} />}
        </div>
      </div>
    </div>
  );
};

export default PartyTitle;
