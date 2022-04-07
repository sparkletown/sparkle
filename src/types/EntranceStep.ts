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
  buttons?: EntranceStepButtonConfig[];
};

export interface EntranceStepTemplateProps {
  config: EntranceStepConfig;
  proceed: () => void;
}
