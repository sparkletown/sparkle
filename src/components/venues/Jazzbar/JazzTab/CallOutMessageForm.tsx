import React from "react";
import { useSelector } from "react-redux";

interface PropsType {
  onSubmit: () => void;
  register: any;
  isMessageToTheBandSent: boolean;
}

const CallOutMessageForm: React.FunctionComponent<PropsType> = ({
  onSubmit,
  register,
  isMessageToTheBandSent,
}) => {
  const { venue } = useSelector((state: any) => ({
    venue: state.firestore.data.currentVenue,
  }));
  return (
    <form onSubmit={onSubmit} className="form-shout-out">
      <input
        name="messageToTheBand"
        placeholder="Shout out to the band"
        ref={register({ required: true })}
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
};

export default CallOutMessageForm;
