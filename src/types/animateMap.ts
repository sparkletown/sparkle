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

type ElepsisTrajectoryOptions = {
  xCoordinate: string;
  yCoordinate: string;
  horizontalRadius: string;
  verticalRadius: string;
  turnAngle: string;
  initialAngle: string;
};

export type ArtCar = {
  elepsisTrajectoryOptions: ElepsisTrajectoryOptions;
  isMoving: boolean;
  linearySpeed: string;
  movementStartTimestamp: string;
  ownerId: string;
  iconSrc: string;
  trackSrc: string;
};
