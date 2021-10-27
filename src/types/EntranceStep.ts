export enum EntranceStepTemplate {
  WelcomeVideo = "welcomevideo",
}

export type EntranceStepButtonConfig = {
  isProceed: boolean;
  text?: string;
  className?: string;
  href?: string;
};

export type EntranceStepConfig = {
  template: EntranceStepTemplate;
  videoUrl?: string;
  autoplay?: boolean;
  welcomeText?: string;
  buttons?: EntranceStepButtonConfig[];
};
