export type Firebarrel = {
  id: string;
  connectedUsers?: string[];
  coordinateX: string;
  coordinateY: string;
  iconSrc: string;
  trackSrc: string;
  isLocked: boolean;
  maxUserCount: number;
};
