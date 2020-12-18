import styled, { css } from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const Label = styled.label`
  display: inline-block;
  width: 6rem;
  height: 2.5rem;
  margin: 0 1rem;

  position: relative;
`;

type SliderType = {
  checked: boolean;
};
const defaultSlider = css`
  background-color: #f6e652;
`;
const checkedSlider = css`
  background-color: #4bcc4b;

  &::before {
    transform: translateX(3.5rem)
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

    width: 2.1rem;
    height: 2.1rem;

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
