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

  if (
    !selectedElementId ||
    selectedElementId !== parentComponent ||
    !selectedUserId
  ) {
    return <></>;
  }

  return <MiniProfileModal userId={selectedUserId} />;
};
