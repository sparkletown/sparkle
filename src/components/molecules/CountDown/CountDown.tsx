import React from "react";
import { getTimeBeforeParty } from "utils/time";

interface PropsType {
  startUtcSeconds: number;
}

const CountDown: React.FunctionComponent<PropsType> = ({ startUtcSeconds }) => {
  const timeBeforeParty = getTimeBeforeParty(startUtcSeconds);
  const isPartyOngoing = timeBeforeParty === 0;
  return !isPartyOngoing ? (
    <div className="primary">Party begins in {timeBeforeParty}</div>
  ) : (
    <></>
  );
};

export default CountDown;
