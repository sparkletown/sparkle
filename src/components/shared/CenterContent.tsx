export const CenterContent: React.FC<React.HTMLProps<HTMLDivElement>> = ({
  children,
  className,
  ...rest
}) => {
  return (
    <div
      {...rest}
      data-bem="CenterContent"
      className="absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 whitespace-nowrap"
    >
      {children}
    </div>
  );
};
