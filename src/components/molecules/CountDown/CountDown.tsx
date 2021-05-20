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

  if (timeBeforeParty === "0") return <></>;

  return (
    <div className="count-down-container">
      {`${textBeforeCountdown || "Begins in"} ${timeBeforeParty}`}
    </div>
  );
};
