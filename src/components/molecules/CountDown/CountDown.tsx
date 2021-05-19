import React from "react";
import { getTimeBeforeParty } from "utils/time";

interface PropsType {
  startUtcSeconds: number;
  textBeforeCountdown?: string;
}

export const CountDown: React.FunctionComponent<PropsType> = ({
  startUtcSeconds,
  textBeforeCountdown,
}) => {
  const timeBeforeParty = getTimeBeforeParty(startUtcSeconds);
  const isPartyOngoing = timeBeforeParty === "0";
  return !isPartyOngoing ? (
    <div className="count-down-container">
      {`${textBeforeCountdown || "Begins in"} ${timeBeforeParty}`}
    </div>
  ) : (
    <></>
  );
};

/**
 * @deprecated use named export instead
 */
export default CountDown;
