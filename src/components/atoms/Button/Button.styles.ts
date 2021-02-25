import styled from "styled-components";

type ButtonProps = {
  hasGradient?: boolean;
};
export const Button = styled.button<ButtonProps>`
  display: inline-block;
  padding: 0.75em 1em;

  border-radius: 1.375em;
  border: none;
  background-color: #361f6e;
  background-image: ${({ hasGradient, disabled }) =>
    hasGradient && !disabled
      ? "linear-gradient(124deg, #00f6d5 0%, #6f43ff 50%, #e15ada 100%)"
      : "none"};

  color: #fff;
  font-size: 1rem;
  font-weight: 700;
  text-align: center;
  text-decoration: none;

  transform: translateY(0);

  transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1);

  &:hover {
    transform: translateY(-1px);
  }
`;
