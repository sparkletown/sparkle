import CN from "./Card.module.scss";

export const CardBody: React.FC<React.HTMLProps<HTMLDivElement>> = ({
  children,
  ...rest
}) => {
  return (
    <div {...rest} data-bem="CardBody" className={CN.cardBody}>
      {children}
    </div>
  );
};
