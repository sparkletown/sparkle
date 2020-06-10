import React from "react";
import CountDown from "components/molecules/CountDown";
import "./PartyTitle.scss";

interface PropsType {
  startUtcSeconds: number;
  withCountDown: boolean;
}

const PartyTitle: React.FunctionComponent<PropsType> = ({
  startUtcSeconds,
  withCountDown,
}) => {
  return (
    <div className="col">
      <h1 className="title">The Boat Party</h1>
      <div className="subtitle-container">
        <img
          className="collective-icon"
          src="/collective-icon.png"
          alt="Co-Reality collective"
          width="20"
          height="20"
        />
        <div>
          Hosted by <a href="https://co-reality.co/">Co-Reality collective</a>{" "}
          {withCountDown && <CountDown startUtcSeconds={startUtcSeconds} />}
        </div>
      </div>
    </div>
  );
};

export default PartyTitle;
