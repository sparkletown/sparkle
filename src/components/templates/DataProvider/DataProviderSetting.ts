export type DataProviderSettingInterface = {
  playerId: string;
  userAvatarUrl?: string;
  // firebase: ExtendedFirebaseInstance;
  playerioGameId: string;
  playerioMaxPlayerPerRoom: number;
  playerioFrequencyUpdate: number;
  playerioAdvancedMode?: boolean;
  reInitOnError?: boolean;
};
