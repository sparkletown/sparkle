export type GetExternalRoomSlugProps = {
  venueName: string;
  roomTitle: string;
};

export const getExternalRoomSlug = ({
  venueName,
  roomTitle,
}: GetExternalRoomSlugProps) => `${venueName}/${roomTitle}`;
