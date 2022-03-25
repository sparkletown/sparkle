import { Button, ButtonProps } from "components/attendee/Button";

export const CardButton: React.FC<ButtonProps> = ({ children, ...rest }) => {
  return (
    <Button {...rest} borderRadius="none" margin="none">
      {children}
    </Button>
  );
};
