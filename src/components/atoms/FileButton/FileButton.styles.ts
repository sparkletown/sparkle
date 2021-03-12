import styled from "styled-components";
import { Button } from "../Button/Button.styles";

export const Wrapper = styled.div`
  display: flex;
  margin-bottom: 3rem;
  flex-direction: column;
  background-color: #19181a;
  border-radius: 16px;
  padding: 40px;
  cursor: pointer;
`;

export const Label = styled(Button)`
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 26px;
  padding: 10px;
  text-align: center;
`;
