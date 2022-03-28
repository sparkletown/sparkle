import cn from "classnames";
import { ButtonProps } from "components/attendee/Button";

import { CardBody } from "./CardBody";
import { CardButton } from "./CardButton";

import CN from "./Card.module.scss";

type CardSize = "small";

interface CardProps {
  size?: CardSize;
}

export const Card: React.FC<CardProps> & {
  Button: React.FC<ButtonProps>;
  Body: React.FC;
} = ({ children, size = "small" }) => {
  return (
    <div data-bem="Card" className={cn(CN.card, CN[size])}>
      {children}
    </div>
  );
};

Card.Button = CardButton;
Card.Body = CardBody;
