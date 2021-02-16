import styled from "styled-components";
import { Button } from "../Button/Button.styles";

export const Wrapper = styled.div`
  display: flex;
  margin-bottom: 3rem;
  flex-direction: column;
`;

export const Label = styled(Button)`
  cursor: pointer;
`;

export const Recommended = styled.span`
  color: #acadb0;
`;
