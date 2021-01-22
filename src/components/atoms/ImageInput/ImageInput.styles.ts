import styled, { css } from "styled-components";

type UploadButtonType = {
  isHidden?: boolean;
};
const defaultButtonStyles = css`
  background-color: #462a87;

  cursor: pointer;

  &:hover,
  &:active,
  &:focus {
    transform: translateY(-1px);
    background-color: rgba(55, 90, 127, 0.18);
  }
`;
const hiddenButtonStyles = css`
  background-color: transparent;
  color: transparent;
  cursor: default;
`;
export const UploadButton = styled.span<UploadButtonType>`
  ${({ isHidden }) => (isHidden ? hiddenButtonStyles : defaultButtonStyles)};

  padding: 0.7em 4.2em;
  margin: 0;

  border-radius: 22px;

  font-weight: bold;

  transition: transform 0.2s ease-in-out, background-color 0.2s ease-in-out;
`;

type WrapperType = {
  small?: boolean;
  hasError?: boolean;
  backgroundImage?: string;
};

const smallWrapperStyles = css`
  display: inline-block;
  padding: 2.5em;

  ${UploadButton} {
    padding: 0.7em 2em;
  }
`;
const defaultWrapperStyles = css`
  display: flex;
  padding: 2.5em 0;
`;
export const Wrapper = styled.div<WrapperType>`
  ${({ small }) => (small ? smallWrapperStyles : defaultWrapperStyles)};

  align-items: center;
  justify-content: center;

  border: ${(props) => (props.hasError ? "2px solid red" : "none")};
  border-radius: 22px;

  background-size: cover;
  background-color: #1a1d24;
  background-image: ${({ backgroundImage }) =>
    backgroundImage ? `url(${backgroundImage})` : "none"};
  background-position: center;

  cursor: pointer;
`;

export const Error = styled.span`
  display: block;

  color: red;
  font-style: italic;
`;
