export interface AvatarGridRoom {
  row: number;
  column: number;
  width: number;
  height: number;
  title: string;
  description: string;
  url: string;
  image_url?: string;
  isFull: boolean;
}
