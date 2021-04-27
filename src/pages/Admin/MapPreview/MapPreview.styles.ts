import styled from "styled-components";
import { Button } from "components/atoms/Button/Button.styles";

export const Wrapper = styled.div`
  width: 100%;
  margin-bottom: 1rem;

  position: relative;
  overflow: hidden;

  border-radius: ${(props) => props.theme.dimensions.borderRadius};
`;

export const EditButton = styled(Button).attrs({
  hasGradient: true,
})`
  position: absolute;
  top: 0;
  right: 0;

  border-radius: 0 0 0 ${(props) => props.theme.dimensions.borderRadius};

  &:hover {
    transform: none;
  }
`;
