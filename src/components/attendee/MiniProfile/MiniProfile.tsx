import { useState } from "react";
import { Popover } from "components/attendee/Popover";

import { ElementId } from "types/id";

import { useProfileModalControls } from "hooks/useProfileModalControls";

import { MiniProfileModal } from "./components";

interface MiniProfileProps {
  parentComponent: ElementId;
}
export const MiniProfile: React.FC<MiniProfileProps> = ({
  parentComponent,
}) => {
  const { selectedUserId, selectedElementId } = useProfileModalControls();
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(
    null
  );
  if (
    !selectedElementId ||
    selectedElementId !== parentComponent ||
    !selectedUserId
  ) {
    return <></>;
  }

  return (
    <div ref={setReferenceElement}>
      <Popover referenceElement={referenceElement}>
        <MiniProfileModal userId={selectedUserId} />
      </Popover>
    </div>
  );
};
