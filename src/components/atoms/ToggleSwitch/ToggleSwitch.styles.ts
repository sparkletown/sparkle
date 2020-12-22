import styled, { css } from "styled-components";

export const Label = styled.label`
  display: inline-block;
  margin: 0 1rem;

  position: relative;
`;

type WrapperProps = {
  large?: boolean;
};
const defaultToggle = css`
  ${Label} {
    width: 40px;
    height: 23px;
  }
`;
const largeToggle = css`
  ${Label} {
    width: 6rem;
    height: 2.5rem;
  }
`;
export const Wrapper = styled.div<WrapperProps>`
  display: flex;
  align-items: center;

  ${({ large }) => (large ? largeToggle : defaultToggle)};
`;

type SliderType = {
  checked: boolean;
  large?: boolean;
};
const defaultSlider = css`
  background-color: #f6e652;
`;
const checkedSlider = css<SliderType>`
  background-color: #4bcc4b;

  &::before {
    transform: ${({ large }) =>
      large ? "translateX(3.5rem)" : "translateX(17px)"};
  }
`;
export const Slider = styled.span`
  ${(props: SliderType) => (props.checked ? checkedSlider : defaultSlider)};

  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  border-radius: 22px;

  cursor: pointer;

  transition: 0.4s;

  &::before {
    content: "";

    width: ${({ large }) => (large ? "2.1rem" : "17px")};
    height: ${({ large }) => (large ? "2.1rem" : "17px")};

    position: absolute;
    bottom: 3px;
    left: 3px;

    background-color: white;
    border-radius: 50%;

    transition: transform ease 0.4s;
  }
`;

export const Input = styled.input.attrs({
  hidden: true,
  type: "checkbox",
})``;

export const Text = styled.span`
  font-size: 1.3rem;
`;
