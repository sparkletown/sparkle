import React from "react";
import { Card } from "react-bootstrap";
import { useAsyncFn } from "react-use";
import Bugsnag from "@bugsnag/js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserFriends,
  faEye,
  faHandPointer,
  faEyeSlash,
  faBan,
} from "@fortawesome/free-solid-svg-icons";

import { RoomInput, upsertRoom } from "api/admin";

import { Room, RoomType } from "types/rooms";
import { VenueEvent } from "types/venues";

import { WithId, WithVenueId } from "utils/id";
import { openRoomUrl } from "utils/url";

import { useUser } from "hooks/useUser";
import { useRoom } from "hooks/useRoom";

import { ButtonNG } from "components/atoms/ButtonNG/ButtonNG";
import { EventCard } from "components/organisms/AdminVenueView/components/EventCard/EventCard";
import { RoomIcon } from "components/organisms/AdminVenueView/components/RoomIcon/RoomIcon";

import "./RoomCard.scss";

interface RoomCardProps {
  room: Room;
  index: number;
  venueId: string;
  venueName: string;
  events?: WithVenueId<WithId<VenueEvent>>[];
}

export const RoomCard: React.FC<RoomCardProps> = ({
  room,
  index,
  venueId,
  venueName,
  events,
}) => {
  const { user } = useUser();

  const { recentRoomUsers } = useRoom({ room, venueName });

  const isRoomUnclickable = room.type === RoomType.unclickable;

  const [{ loading: isTogglingRoom }, toggleRoom] = useAsyncFn(async () => {
    if (!user) return;

    try {
      const roomValues: RoomInput = {
        ...room,
        isEnabled: !room.isEnabled,
      };

      await upsertRoom(roomValues, venueId, user, index);
    } catch (e) {
      Bugsnag.notify(e, (event) => {
        event.addMetadata("AdminVenueView/RoomCard::updateRoom", {
          venueId: venueId,
          roomIndex: index,
          newState: !room.isEnabled,
        });
      });
    }
  }, [index, room, user, venueId]);

  const [
    { loading: isTogglingClickability },
    toggleRoomClickablility,
  ] = useAsyncFn(async () => {
    if (!user) return;

    const roomType = isRoomUnclickable ? undefined : RoomType.unclickable;

    try {
      const roomValues: RoomInput = {
        ...room,
        type: roomType,
      };

      await upsertRoom(roomValues, venueId, user, index);
    } catch (e) {
      Bugsnag.notify(e, (event) => {
        event.addMetadata("AdminVenueView/RoomCard::updateRoom", {
          venueId: venueId,
          roomIndex: index,
          newState: !room.isEnabled,
        });
      });
    }
  }, [index, isRoomUnclickable, room, user, venueId]);

  return (
    <div className="RoomCard__card">
      <div className="RoomCard__header">
        <RoomIcon src={room.image_url} className="RoomCard__icon" />
        <Card.Title className="RoomCard__title">{room.title}</Card.Title>
        <div className="RoomCard__counter">
          <FontAwesomeIcon icon={faUserFriends} />
          {recentRoomUsers.length}
        </div>
        <div className="RoomCard__type">{room.template}</div>
        <div className="RoomCard__link" onClick={() => openRoomUrl(room.url)}>
          {room.url}
        </div>
      </div>

      <EventCard events={events} />

      <div className="RoomCard__footer">
        <div className="RoomCard__footer--left">
          <ButtonNG
            iconOnly={true}
            iconName={room.isEnabled ? faEye : faEyeSlash}
            disabled={isTogglingRoom}
            onClick={toggleRoom}
          />
          <ButtonNG
            iconOnly={true}
            iconName={isRoomUnclickable ? faBan : faHandPointer}
            disabled={isTogglingClickability}
            onClick={toggleRoomClickablility}
          />
        </div>
      </div>
    </div>
  );
};
