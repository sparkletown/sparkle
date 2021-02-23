import styled, { css } from "styled-components";

type UploadButtonType = {
  isHidden?: boolean;
};
const defaultButtonStyles = css`
  background-color: rgba(255, 255, 255, 0.2);

  cursor: pointer;
`;
const hiddenButtonStyles = css`
  background-color: transparent;
  color: transparent;
  cursor: default;
`;
export const UploadButton = styled.span<UploadButtonType>`
  ${({ isHidden }) => (isHidden ? hiddenButtonStyles : defaultButtonStyles)};

  padding: 0.8em;
  margin: 0;
  border-radius: 6px;
  transition: transform 0.2s ease-in-out, background-color 0.2s ease-in-out;
`;

type WrapperType = {
  small?: boolean;
  hasError?: boolean;
  backgroundImage?: string;
};

const smallWrapperStyles = css`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
  width: 180px;
`;
const defaultWrapperStyles = css`
  display: flex;
  padding: 2.5em 0;
  border-radius: 22px;
  max-width: 360px;
`;
export const Wrapper = styled.div<WrapperType>`
  ${({ small }) => (small ? smallWrapperStyles : defaultWrapperStyles)};

  height: 180px;
  align-items: center;
  justify-content: center;
  border: ${(props) => (props.hasError ? "2px solid red" : "none")};
  background-size: cover;
  background-color: #19181a;
  background-image: ${({ backgroundImage }) =>
    backgroundImage ? `url(${backgroundImage})` : "none"};
  background-position: center;
  cursor: pointer;

  &:hover {
    background-color: rgba(255, 255, 255, 0.16);
  }

  ${UploadButton} {
    border-radius: 22px;
    background-color: rgba(255, 255, 255, 0.12);
  }
`;

export const Error = styled.span`
  display: block;

  color: red;
  font-style: italic;
`;
