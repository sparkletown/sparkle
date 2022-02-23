import { SPACE_TAXON } from "settings";

import { useSpaceParams } from "hooks/spaces/useSpaceParams";
import { useWorldAndSpaceBySlug } from "hooks/spaces/useWorldAndSpaceBySlug";
import { useShowHide } from "hooks/useShowHide";

import { Button } from "../Button";
import { NavOverlay } from "../NavOverlay/NavOverlay";

import CN from "./AttendeeHeader.module.scss";

export const AttendeeHeader = () => {
  const { isShown: isScheduleShown, hide, show } = useShowHide(false);
  const { worldSlug, spaceSlug } = useSpaceParams();
  const { space } = useWorldAndSpaceBySlug(worldSlug, spaceSlug);

  return (
    <header className={CN.attendeeHeader}>
      <div className={CN.attendeeHeader__container}>
        <div>
          <Button>{space?.name ?? `This ${SPACE_TAXON.title}`}</Button>
        </div>
        <div>
          <Button onClick={show}>Schedule</Button>
          <Button>Profile</Button>
          <Button>Search</Button>
        </div>
      </div>
      <NavOverlay isShown={isScheduleShown} onClose={hide} type="Schedule" />
    </header>
  );
};
