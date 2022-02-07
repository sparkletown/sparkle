import styles from "./Button.module.scss";

type ButtonProps = {
  onClick?: () => void;
};
export const Button: React.FC<ButtonProps> = ({ onClick, children }) => (
  <button className={styles.Button} onClick={onClick}>
    {children}
  </button>
);
