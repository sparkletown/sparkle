import { faUserFriends } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./PosterAttendance.scss";

interface PosterAttendanceProps {
  userCount: number;
}

export const PosterAttendance: React.FC<PosterAttendanceProps> = ({
  userCount,
}) => {
  if (userCount === 0) return <></>;

  return (
    <div className="PosterAttendance">
      <FontAwesomeIcon
        className="PosterAttendance--icon"
        icon={faUserFriends}
      />
      <span>{userCount}</span>
    </div>
  );
};
