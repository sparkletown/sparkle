import React from "react";

import { getTimeBeforeParty } from "utils/time";

interface PropsType {
  startUtcSeconds: number;
  textBeforeCountdown?: string;
}

export const CountDown: React.FunctionComponent<PropsType> = ({
  startUtcSeconds,
  textBeforeCountdown = "Begins in",
}) => {
  const timeBeforeParty = getTimeBeforeParty(startUtcSeconds);

  if (timeBeforeParty === "0") return null;

  return (
    <div className="count-down-container">
      {textBeforeCountdown} {timeBeforeParty}
    </div>
  );
};
