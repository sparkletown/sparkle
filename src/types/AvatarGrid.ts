export interface AvatarGridRoom {
  row: number;
  column: number;
  width: number;
  height: number;
  name: string;
  description: string;
  url: string;
  image_url?: string;
  isFull: boolean;
}
