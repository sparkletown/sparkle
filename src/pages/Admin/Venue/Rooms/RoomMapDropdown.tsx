import React, { useMemo, useState, Dispatch, SetStateAction } from "react";
import { useCallback } from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";

const roomMapZoomLevels = [
  { level: 1 },
  { level: 2 },
  { level: 3 },
  { level: 4 },
];

interface RoomMapDropdownType {
  onZoomChange: Dispatch<SetStateAction<number>>;
}

export const RoomMapDropdown: React.FC<RoomMapDropdownType> = ({
  onZoomChange,
}) => {
  const [roomMapZoomLevel, changeRoomMapZoomLevel] = useState(1);

  const handleZoomLevelChange = useCallback(
    (zoomLevel: number) => {
      onZoomChange(zoomLevel);
      changeRoomMapZoomLevel(zoomLevel);
    },
    [onZoomChange, changeRoomMapZoomLevel]
  );

  const RoomMapDropdownOptions = useMemo(
    () =>
      roomMapZoomLevels.map(({ level }) => (
        <Dropdown.Item key={level} onClick={() => handleZoomLevelChange(level)}>
          {level}
        </Dropdown.Item>
      )),
    [handleZoomLevelChange]
  );

  return (
    <div className="map-zoom-container">
      <p>Zoom Level</p>
      {/* @debt replace with our own dropdown component */}
      <DropdownButton
        id="map-zoom-dropdown"
        title={roomMapZoomLevel ?? "change status"}
        className="RoomMapDropdown"
      >
        {RoomMapDropdownOptions}
      </DropdownButton>
    </div>
  );
};
