import { useShowHide } from "hooks/useShowHide";

import { Button } from "../Button/Button";
import { Overlay } from "../Overlay/Overlay";

import styles from "./AttendeeHeader.module.scss";

export const AttendeeHeader = () => {
  const { isShown: isScheduleShown, hide, show } = useShowHide(false);

  return (
    <header className={styles.AttendeeHeader}>
      <div className={styles.AttendeeHeader__container}>
        <div>
          <Button>Earth Center</Button>
        </div>
        <div>
          <Button onClick={show}>Schedule</Button>
          <Button>Profile</Button>
          <Button>Search</Button>
        </div>
      </div>
      <Overlay isShown={isScheduleShown} onClose={hide} type="Schedule" />
    </header>
  );
};
