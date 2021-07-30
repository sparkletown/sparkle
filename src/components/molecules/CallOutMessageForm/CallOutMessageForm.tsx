import React from "react";

import { currentVenueSelectorData } from "utils/selectors";

import { useSelector } from "hooks/useSelector";

interface PropsType {
  onSubmit: () => void;
  placeholder: string;
  isMessageToTheBandSent: boolean;
}

// @debt This file doesn't appear to be used anywhere anymore. We can probably remove it in our next tech-debt cleanup pass
//   Edit by 0xdevalias: This seems to related to extracting the common functionality of shoutouts, which does exist still, but not
//     everywhere uses this component so really, we should be updating those places to properly make use of this component, or
//     something like it.
// eslint-disable-next-line react/display-name
const CallOutMessageForm = React.forwardRef<HTMLInputElement, PropsType>(
  ({ onSubmit, placeholder, isMessageToTheBandSent }, ref) => {
    const venue = useSelector(currentVenueSelectorData);
    return (
      <form onSubmit={onSubmit} className="form-message">
        <input name="messageToTheBand" placeholder={placeholder} ref={ref} />
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
