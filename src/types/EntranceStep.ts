export enum EntranceStepTemplate {
  WelcomeVideo = "welcomevideo",
}

export type EntranceStepConfig = {
  template: EntranceStepTemplate;
  videoUrl?: string;
  autoplay?: boolean;
};
