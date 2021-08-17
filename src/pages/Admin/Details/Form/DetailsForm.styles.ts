import styled from "styled-components";

type InputContainerType = {
  hasError?: boolean;
};
export const InputContainer = styled.div`
  position: relative;

  input {
    border: ${(props: InputContainerType) =>
      props.hasError ? "2px solid red" : "none"};

    &:focus {
      outline: none;
    }
  }
`;
