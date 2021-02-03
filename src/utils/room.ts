export type GetExternalRoomSlugProps = {
  currentVenueName: string;
  roomTitle: string;
};

export const getExternalRoomSlug = ({
  currentVenueName,
  roomTitle,
}: GetExternalRoomSlugProps) => `${currentVenueName}/${roomTitle}`;
