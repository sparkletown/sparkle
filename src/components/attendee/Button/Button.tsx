import CN from "./Button.module.scss";

type ButtonProps = {
  onClick?: () => void;
};

export const Button: React.FC<ButtonProps> = ({ onClick, children }) => (
  <button className={CN.button} onClick={onClick}>
    {children}
  </button>
);
