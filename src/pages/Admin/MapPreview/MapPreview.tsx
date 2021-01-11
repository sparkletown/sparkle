import React, { useMemo, useRef, useState } from "react";
import { isEqual } from "lodash";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { updateRoom, updateVenue_v2 } from "api/admin";

import { useUser } from "hooks/useUser";

import {
  Container,
  SubVenueIconMap,
} from "pages/Account/Venue/VenueMapEdition/Container";
import Legend from "components/atoms/Legend";
import * as S from "./MapPreview.styles";
import BackgroundSelect from "../BackgroundSelect";
import { MapPreviewProps } from "./MapPreview.types";

const MapPreview: React.FC<MapPreviewProps> = ({
  venueName,
  mapBackground,
  rooms,
  venueId,
  editing,
  setEditing,
}) => {
  const { user } = useUser();
  const [mapRooms, setMapRooms] = useState(rooms);

  const roomRef = useRef<SubVenueIconMap>({});

  const iconsMap = useMemo(
    () =>
      mapRooms!.map((room, index: number) => ({
        width: room.width_percent,
        height: room.height_percent,
        top: room.y_percent,
        left: room.x_percent,
        url: room.image_url,
        roomIndex: index,
      })),
    [mapRooms]
  );
  console.log(rooms, mapRooms);

  if (!user) return <></>;

  const handleOnChange = (val: SubVenueIconMap) => {
    if (!isEqual(roomRef.current, val)) {
      roomRef.current = val;
      const normalizeRooms = Object.values(val).map((room, index) => ({
        ...rooms![index],
        x_percent: room.left,
        y_percent: room.top,
        width_percent: room.width,
        height_percent: room.height,
      }));
      setMapRooms(normalizeRooms);
      console.log("asdasd", val);
    }
  };

  const handleSavePositions = async () => {
    const roomArr = Object.values(roomRef.current);

    let roomIndex = 0;

    for (const r of roomArr) {
      const room = {
        ...rooms![roomIndex],
        x_percent: r.left,
        y_percent: r.top,
        width_percent: r.width,
        height_percent: r.height,
      };

      roomIndex++;

      await updateRoom(room, venueId, user, r.roomIndex!);
    }

    setEditing(false);
  };

  const handleBackgroundRemove = () => {
    if (!user) return;

    return updateVenue_v2(
      {
        name: venueName,
        mapBackgroundImageUrl: "",
      },
      user
    );
  };

  const handleEditButton = async () => {
    if (editing) {
      return await handleSavePositions();
    }

    return setEditing(true);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <S.Wrapper>
        <Legend text={`${venueName}'s Map`} />

        {!!mapBackground && (
          <Legend
            text="Edit background"
            position="right"
            onClick={() => handleBackgroundRemove()}
          />
        )}

        {!editing && (
          <BackgroundSelect
            venueName={venueName}
            mapBackground={mapBackground}
          />
        )}

        {mapBackground &&
          !editing &&
          mapRooms?.map((room) => (
            <div
              key={room.title}
              style={{
                position: "absolute",
                top: `${room.y_percent}%`,
                left: `${room.x_percent}%`,
                width: `${room.width_percent}%`,
                height: `${room.height_percent}%`,
              }}
            >
              <img
                style={{
                  width: "100%",
                  height: "100%",
                  filter: room.isEnabled ? "none" : "grayscale(100%)",
                  opacity: room.isEnabled ? 1 : 0.5,
                  transition: "filter .3s ease",
                }}
                src={room.image_url}
                alt="room banner"
                title={room.title}
              />
            </div>
          ))}

        {mapBackground && editing && (
          <Container
            interactive
            resizable
            onChange={handleOnChange}
            backgroundImage={mapBackground}
            otherIcons={{}}
            // @ts-ignore
            iconsMap={iconsMap}
            coordinatesBoundary={{
              width: 100,
              height: 100,
            }}
            otherIconsStyle={{ opacity: 0.4 }}
            // lockAspectRatio
          />
        )}

        <S.EditButton onClick={handleEditButton}>
          {editing ? "Save layout" : "Edit layout"}
        </S.EditButton>
      </S.Wrapper>
    </DndProvider>
  );
};

export default MapPreview;
