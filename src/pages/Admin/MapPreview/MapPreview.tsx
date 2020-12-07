import React, { useRef, useState } from "react";

import { MapPreviewProps } from "./MapPreview.types";

import * as S from "./MapPreview.styles";
import BackgroundSelect from "../BackgroundSelect";

import { updateRoom, updateVenue_v2 } from "api/admin";
import { useUser } from "hooks/useUser";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  Container,
  SubVenueIconMap,
} from "pages/Account/Venue/VenueMapEdition/Container";
import _ from "lodash";
import Legend from "components/atoms/Legend";

const MapPreview: React.FC<MapPreviewProps> = ({
  venueName,
  mapBackground,
  rooms,
  venueId,
}) => {
  const { user } = useUser();
  const [editing, setEditing] = useState<boolean>(false);

  const roomRef = useRef<SubVenueIconMap>({});

  if (!user) return <></>;

  const iconsMap = rooms!.map((room, index: number) => ({
    width: room.width_percent,
    height: room.height_percent,
    top: room.y_percent,
    left: room.x_percent,
    url: room.image_url,
    roomIndex: index,
  }));

  const handleOnChange = (val: SubVenueIconMap) => {
    if (!_.isEqual(roomRef.current, val)) {
      roomRef.current = val;
    }
  };

  const handleSavePositions = async () => {
    const roomArr = Object.values(roomRef.current);

    roomArr.forEach(async (r, index) => {
      const room = {
        ...rooms![index],
        x_percent: r.left,
        y_percent: r.top,
        width_percent: r.width,
        height_percent: r.height,
      };
      await updateRoom(room, venueId, user, r.roomIndex!);
    });

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

  const handleEditButton = () => {
    if (editing) {
      return handleSavePositions();
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
          rooms?.map((room) => (
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

        <S.EditButton onClick={() => handleEditButton()}>
          {editing ? "Save layout" : "Edit layout"}
        </S.EditButton>
      </S.Wrapper>
    </DndProvider>
  );
};

export default MapPreview;
