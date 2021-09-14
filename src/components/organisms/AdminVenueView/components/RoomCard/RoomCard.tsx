import React from "react";
import { Card } from "react-bootstrap";
import { useAsyncFn } from "react-use";
import {
  faBan,
  faEye,
  faEyeSlash,
  faHandPointer,
  faUserFriends,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { RoomInput, upsertRoom } from "api/admin";

import { Room, RoomType } from "types/rooms";
import { VenueEvent } from "types/venues";

import { WithId, WithVenueId } from "utils/id";
import { openRoomUrl } from "utils/url";

import { useRoom } from "hooks/useRoom";
import { useRecentVenueUsers } from "hooks/users";
import { useUser } from "hooks/useUser";

import { EventCard } from "components/organisms/AdminVenueView/components/EventCard/EventCard";
import { PrettyLink } from "components/organisms/AdminVenueView/components/PrettyLink";
import { RoomIcon } from "components/organisms/AdminVenueView/components/RoomIcon/RoomIcon";

import { ButtonNG } from "components/atoms/ButtonNG";

import "./RoomCard.scss";

interface RoomCardProps {
  room: Room;
  index: number;
  venueId: string;
  events?: WithVenueId<WithId<VenueEvent>>[];
}

export const RoomCard: React.FC<RoomCardProps> = ({
  room,
  index,
  venueId,
  events,
}) => {
  const { user } = useUser();

  const { portalVenueId } = useRoom({ room });

  const { recentVenueUsers: recentRoomUsers } = useRecentVenueUsers({
    venueId: portalVenueId,
  });

  const isRoomUnclickable = room.type === RoomType.unclickable;

  const [{ loading: isTogglingRoom }, toggleRoom] = useAsyncFn(async () => {
    if (!user) return;

    const roomValues: RoomInput = {
      ...room,
      isEnabled: !room.isEnabled,
    };

    await upsertRoom(roomValues, venueId, user, index);
  }, [index, room, user, venueId]);

  const [
    { loading: isTogglingClickability },
    toggleRoomClickablility,
  ] = useAsyncFn(async () => {
    if (!user) return;

    const newRoomType = !isRoomUnclickable ? RoomType.unclickable : undefined;

    const roomValues: RoomInput = {
      ...room,
      type: newRoomType,
    };

    await upsertRoom(roomValues, venueId, user, index);
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
        <div className="RoomCard__link">
          <PrettyLink title={room.url} onClick={() => openRoomUrl(room.url)} />
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
            title={`click to ${room.isEnabled ? "hide" : "show"} room`}
          />
          <ButtonNG
            iconOnly={true}
            iconName={isRoomUnclickable ? faBan : faHandPointer}
            disabled={isTogglingClickability}
            onClick={toggleRoomClickablility}
            title={`make room ${isRoomUnclickable ? "" : "un"}clickable`}
          />
        </div>
      </div>
    </div>
  );
};
