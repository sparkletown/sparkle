import React from "react";
import { getTimeBeforeParty } from "../../../utils/time";
import "./PartyTitle.scss";

interface PropsType {
  startUtcSeconds: number;
  withCountDown: boolean;
}

const PartyTitle: React.FunctionComponent<PropsType> = ({
  startUtcSeconds,
  withCountDown,
}) => (
  <div className="col">
    <h1 className="title">The Boat Party</h1>
    <div className="subtitle-container">
      <img
        className="collective-icon"
        src="collective-icon.png"
        alt="Co-Reality collective"
        width="20"
        height="20"
      />
      <div>
        Hosted by <a href="https://co-reality.co/">Co-Reality collective</a>{" "}
        {withCountDown && (
          <div className="primary">
            Party begins in {getTimeBeforeParty(startUtcSeconds)}
          </div>
        )}
      </div>
    </div>
  </div>
);

export default PartyTitle;
