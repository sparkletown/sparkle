import React from "react";

import { currentVenueSelectorData } from "utils/selectors";

import { useSelector } from "hooks/useSelector";

interface PropsType {
  onSubmit: () => void;
  placeholder: string;
  isMessageToTheBandSent: boolean;
}

// eslint-disable-next-line react/display-name
const CallOutMessageForm = React.forwardRef<HTMLInputElement, PropsType>(
  ({ onSubmit, placeholder, isMessageToTheBandSent }, ref) => {
    const venue = useSelector(currentVenueSelectorData);
    return (
      <form onSubmit={onSubmit} className="form-message">
        <input
          name="messageToTheBand"
          placeholder={placeholder}
          ref={ref}
          style={{ marginBottom: "10px" }}
        />
        {venue && (
          <input
            className={`btn btn-primary btn-block btn-centered ${
              isMessageToTheBandSent ? "btn-success" : ""
            } `}
            type="submit"
            id={`send-shout-out-${venue.name}`}
            value={isMessageToTheBandSent ? "Sent!" : "Send"}
            disabled={isMessageToTheBandSent}
          />
        )}
      </form>
    );
  }
);

export default CallOutMessageForm;
