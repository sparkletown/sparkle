export interface RoomCardProps {
  title: string;
  description?: string;
  image_url: string;
  editHandler: () => void;
  onEventHandler: (title: string) => void;
}
