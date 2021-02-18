/// <reference types="react-scripts" />

declare module "react-eventbrite-popup-checkout" {
  interface PropType {
    ebEventId: string;
    className: string;
    isModal?: boolean;
    onOrderComplete?: () => void;
  }
  const EventbriteButton: React.FunctionComponent<PropType>;
  export default EventbriteButton;
}
