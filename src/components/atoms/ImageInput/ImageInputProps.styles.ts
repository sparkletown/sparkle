import styled, { css } from "styled-components";

type UploadButtonType = {
  isHidden?: boolean;
};
const defaultButton = css`
  background-color: #462a87;

  cursor: pointer;

  &:hover,
  &:active,
  &:focus {
    transform: translateY(-1px);
    background-color: rgba(55, 90, 127, 0.18);
  }
`;
const hiddenButton = css`
  background-color: transparent;
  color: transparent;
  cursor: default;
`;
export const UploadButton = styled.span`
  ${(props: UploadButtonType) =>
    props.isHidden ? hiddenButton : defaultButton};

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

const smallWrapper = css`
  display: inline-block;
  padding: 2.5em;

  ${UploadButton} {
    padding: 0.7em 2em;
  }
`;
const defaultWrapper = css`
  display: flex;
  padding: 2.5em 0;
`;
export const Wrapper = styled.div`
  ${(props: WrapperType) => (props.small ? smallWrapper : defaultWrapper)};

  align-items: center;
  justify-content: center;

  border: ${(props) => (props.hasError ? "2px solid red" : "none")};
  border-radius: 22px;

  background-size: cover;
  background-color: #1a1d24;
  background-image: ${(props) =>
    props.backgroundImage ? `url(${props.backgroundImage})` : "none"};
  background-position: center;

  cursor: pointer;
`;

export const Error = styled.span`
  display: block;

  color: red;
  font-style: italic;
`;
