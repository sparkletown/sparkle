export interface RoomModalProps {
  isVisible: boolean;
  templates?: string[];
  venueId: string;
  onSubmitHandler: () => void;
}
