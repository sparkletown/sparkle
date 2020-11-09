import styled, { css } from "styled-components";

export const TEMP = styled.div`
  .image-input.default-container {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    position: relative;
    border-radius: 10px;
    overflow: hidden;
  }

  .image-input .default-image {
    width: 100%;
  }

  .image-input .default-input {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    opacity: 0;
    color: transparent;
  }
  .image-input .default-input::-webkit-file-upload-button {
    visibility: hidden;
  }

  .image-input .default-input:focus {
    opacity: 1;
    border-radius: 0;
  }

  .image-input .empty {
    flex: 1;
    padding: 40px 10px;
    background-color: gray;
    height: 100%;
  }

  .image-input .empty .text {
    text-align: center;
  }
`;

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

  background-color: #1a1d24;
  border-radius: 22px;
  border: ${(props) => (props.hasError ? "2px solid red" : "none")};

  background-image: ${(props) =>
    props.backgroundImage ? `url(${props.backgroundImage})` : "none"};
  background-size: cover;
  background-position: center;
`;

export const Error = styled.span`
  display: block;

  color: red;
  font-style: italic;
`;
