/*
 * The card component for the visual side of booths.
 */

import { Button } from "../Button";

import styles from "./BoothCard.module.scss";

interface BoothCardProps {
  title: string;
  onButtonClick: () => void;
  buttonDisabled?: boolean;
  buttonText: string;
}

export const BoothCard: React.FC<BoothCardProps> = ({
  buttonDisabled = false,
  buttonText,
  children,
  title,
  onButtonClick,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.contents}>
        <span className={styles.title}>{title}</span>
        {children}
      </div>
      <Button
        variant="panel-primary"
        onClick={onButtonClick}
        disabled={buttonDisabled}
      >
        {buttonText}
      </Button>
    </div>
  );
};
