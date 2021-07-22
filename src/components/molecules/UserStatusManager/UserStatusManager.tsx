import React, { useCallback, useMemo } from "react";
import { Button } from "react-bootstrap";

import { UserStatus } from "types/User";

import { Checkbox } from "components/atoms/Checkbox";

import { UserStatusPanel } from "./components/UserStatusPanel";

import "./UserStatusManager.scss";

export interface UserStatusManagerProps {
  venueId?: string;
  checked: boolean;
  userStatuses: UserStatus[];
  onCheck?: () => void;
  onDelete?: (index: number) => void;
  onAdd?: () => void;
  onPickColor?: (color: string, index: number) => void;
  onChangeInput?: (
    value: React.FormEvent<HTMLInputElement>,
    index: number
  ) => void;
}

export const UserStatusManager: React.FC<UserStatusManagerProps> = ({
  checked,
  onCheck,
  userStatuses,
  onDelete,
  onAdd,
  onPickColor,
  onChangeInput,
}) => {
  const deleteStatus = useCallback(
    (index: number) => {
      onDelete && onDelete(index);
    },
    [onDelete]
  );

  const changeInput = useCallback(
    (value: React.FormEvent<HTMLInputElement>, index: number) => {
      onChangeInput && onChangeInput(value, index);
    },
    [onChangeInput]
  );

  const pickColor = useCallback(
    (color: string, index: number) => {
      onPickColor && onPickColor(color, index);
    },
    [onPickColor]
  );

  const renderVenueUserStatuses = useMemo(
    () =>
      userStatuses.map((userStatus, index) => (
        <UserStatusPanel
          key={`${userStatus}-${index}`}
          userStatus={userStatus}
          onPickColor={(color) => pickColor(color, index)}
          onChangeInput={(value) => changeInput(value, index)}
          onDelete={() => deleteStatus(index)}
        />
      )),
    [changeInput, deleteStatus, pickColor, userStatuses]
  );

  return (
    <div className="UserStatusManager">
      <div className="UserStatusManager__checkbox">
        <Checkbox checked={checked} onChange={onCheck} />
        <div>
          <div>User statuses</div>
          <div className="UserStatusManager__description">
            Attendees can set a special status on their profile (minimum 2)
          </div>
          <div className="UserStatusManager__description">
            Example: Available, Busy, is sleeping...
          </div>
        </div>
      </div>
      {checked && (
        <>
          {renderVenueUserStatuses}
          <Button onClick={onAdd}>Add a status</Button>
        </>
      )}
    </div>
  );
};
