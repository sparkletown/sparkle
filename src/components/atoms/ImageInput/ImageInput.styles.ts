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
  height: 100%;
  justify-content: center;
  align-items: center;
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
