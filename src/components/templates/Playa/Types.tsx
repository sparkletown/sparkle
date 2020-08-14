export enum ActionType {
  Move = "MOVE",
  // ToggleFullscreen = "TOGGLE_FULLSCREEN",
  // ToggleVideo = "TOGGLE_VIDEO",
  // ToggleAudio = "TOGGLE_AUDIO",
  // AddContent = "ADD_CONTENT",
  // SendChat = 'SEND_CHAT',
}
export type Action = {
  type: ActionType.Move;
  payload: { x?: number; y?: number; z?: number; rate?: number };
};
// | { type: ActionType.ToggleFullscreen }
// | { type: ActionType.ToggleVideo }
// | { type: ActionType.ToggleAudio }
// | { type: ActionType.AddContent }
// | { type: ActionType.SendChat };

export type State = {
  center: { x: number; y: number; z: number };
  rate: number;
};
