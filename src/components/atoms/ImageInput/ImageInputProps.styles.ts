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

type WrapperType = {
  small?: boolean;
}

const smallWrapper = css`
  display: inline-block;
  padding: 2.5em;
`;
const defaultWrapper = css`
display: flex;
padding: 2.5em 0;
`;
export const Wrapper = styled.div`
  ${(props: WrapperType) => props.small ? smallWrapper : defaultWrapper};

  align-items: center;
  justify-content: center;

  background-color: #1a1d24;
  border-radius: 22px;
`;

export const Input = styled.input.attrs({
  type: "file",
  hidden: true,
})``;

export const Label = styled.label`
  padding: 0.7em 4.2em;
  margin: 0;

  background-color: #462a87;
  border-radius: 22px;

  font-weight: bold;

  cursor: pointer;

  transition: transform 0.2s ease-in-out, background-color 0.2s ease-in-out;

  &:hover,
  &:active,
  &:focus {
    transform: translateY(-1px);
    background-color: rgba(55, 90, 127, 0.18);
  }
`;
