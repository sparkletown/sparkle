import React from "react";

import { PartyMapVenue } from "types/venues";

import { currentVenueSelectorData } from "utils/selectors";

import { useSelector } from "hooks/useSelector";

import { CountDown } from "components/molecules/CountDown";

import "./PartyTitle.scss";

interface PropsType {
  startUtcSeconds: number;
  withCountDown: boolean;
}

export const PartyTitle: React.FunctionComponent<PropsType> = ({
  startUtcSeconds,
  withCountDown,
}) => {
  const venue = useSelector(currentVenueSelectorData) as PartyMapVenue;

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
