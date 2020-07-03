import React from "react";

interface PropsType {
  onSubmit: () => void;
  register: any;
  isMessageToTheBandSent: boolean;
}

const CallOutMessageForm: React.FunctionComponent<PropsType> = ({
  onSubmit,
  register,
  isMessageToTheBandSent,
}) => (
  <form onSubmit={onSubmit} className="form-shout-out">
    <input
      name="messageToTheBand"
      placeholder="Shout out to the band"
      ref={register({ required: true })}
    />
    <input
      className={`btn btn-primary btn-block btn-centered ${
        isMessageToTheBandSent ? "btn-success" : ""
      } `}
      type="submit"
      value={isMessageToTheBandSent ? "Sent!" : "Send"}
      disabled={isMessageToTheBandSent}
    />
  </form>
);

export default CallOutMessageForm;
