import React from "react";
import { useSelector } from "hooks/useSelector";

interface PropsType {
  onSubmit: () => void;
  register: any;
  placeholder: string;
  isMessageToTheBandSent: boolean;
}

const CallOutMessageForm: React.FunctionComponent<PropsType> = ({
  onSubmit,
  register,
  placeholder,
  isMessageToTheBandSent,
}) => {
  const { venue } = useSelector((state) => ({
    venue: state.firestore.data.currentVenue,
  }));
  return (
    <form onSubmit={onSubmit} className="form-message">
      <input
        name="messageToTheBand"
        placeholder={placeholder}
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
