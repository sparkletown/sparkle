import { SPACE_TAXON } from "settings";

import { UserWithId } from "types/id";

import { useSpaceParams } from "hooks/spaces/useSpaceParams";
import { useWorldAndSpaceBySlug } from "hooks/spaces/useWorldAndSpaceBySlug";
import { useShowHide } from "hooks/useShowHide";
import { useUser } from "hooks/useUser";

import { Attendance } from "../Attendance";
import { Button } from "../Button";
import { NavOverlay } from "../NavOverlay/NavOverlay";

import CN from "./AttendeeHeader.module.scss";

export const AttendeeHeader = () => {
  const { isShown: isScheduleShown, hide, show } = useShowHide(false);
  const { worldSlug, spaceSlug } = useSpaceParams();
  const { space } = useWorldAndSpaceBySlug(worldSlug, spaceSlug);

  // MOCK DATA

  const { userWithId } = useUser();

  if (!userWithId) return null;

  const mockData: UserWithId[] = Array(30).fill(userWithId);

  console.log(userWithId, mockData);

  return (
    <header className={CN.attendeeHeader}>
      <div className={CN.attendeeHeader__container}>
        <div>
          <Button>{space?.name ?? `This ${SPACE_TAXON.title}`}</Button>
        </div>
        <Attendance totalUsersCount={60} usersSample={mockData} />
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
