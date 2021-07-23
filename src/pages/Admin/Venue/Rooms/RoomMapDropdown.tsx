import React, { useMemo, useState, Dispatch, SetStateAction } from "react";
import { useCallback } from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { AVAILABLE_ZOOM_LEVELS } from "settings";

interface RoomMapDropdownProps {
  onZoomChange: Dispatch<SetStateAction<number>>;
}

export const RoomMapDropdown: React.FC<RoomMapDropdownProps> = ({
  onZoomChange,
}) => {
  const [roomMapZoomLevel, setRoomMapZoomLevel] = useState(1);

  const handleZoomLevelChange = useCallback(
    (zoomLevel: number) => {
      onZoomChange(zoomLevel);
      setRoomMapZoomLevel(zoomLevel);
    },
    [onZoomChange, setRoomMapZoomLevel]
  );

  const renderedRoomMapDropdownOptions = useMemo(
    () =>
      AVAILABLE_ZOOM_LEVELS.map((level) => (
        <Dropdown.Item key={level} onClick={() => handleZoomLevelChange(level)}>
          {level}
        </Dropdown.Item>
      )),
    [handleZoomLevelChange]
  );

  return (
    <div className="RoomMapDropdown">
      <p>Zoom Level</p>
      {/* @debt replace with our own dropdown component */}
      <DropdownButton
        id="map-zoom-dropdown"
        title={roomMapZoomLevel ?? "change status"}
        className="RoomMapDropdown_button"
      >
        {renderedRoomMapDropdownOptions}
      </DropdownButton>
    </div>
  );
};
