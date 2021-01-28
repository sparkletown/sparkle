import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";

type Props = {
  message?: string;
  className?: string;
};

const Announcement = ({ message, className }: Props) => {
  const [announcement, setAnnouncement] = useState<string | undefined>("");
  useEffect(() => {
    if (message !== announcement && message !== null) {
      setAnnouncement(message);
      showAnnouncement();
    }
  }, [announcement, message]);
  const [isVisible, setVisibility] = useState<boolean>(false);
  const showAnnouncement = () => {
    setVisibility(true);
  };
  const hideAnnouncement = () => {
    setVisibility(false);
  };

  return (
    <>
      {isVisible && message !== null && (
        <div className={className}>
          {message}
          <span className="close-button" onClick={hideAnnouncement}>
            <FontAwesomeIcon icon={faTimesCircle} />{" "}
          </span>
        </div>
      )}
    </>
  );
};

Announcement.defaultProps = {
  message: null,
  className: "announcement-container",
};

export default Announcement;
