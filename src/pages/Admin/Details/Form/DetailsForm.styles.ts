import { Form } from "react-bootstrap";
import styled from "styled-components";

export const VenueForm = styled(Form)`
  position: relative;
`;

export const FormInnerWrapper = styled.div`
  padding: 1em 5em;
`;

export const FormFooter = styled.div`
  display: flex;
  padding: 1em 3em;
  justify-content: end;

  border-top: 1px solid rgba(255, 255, 255, 0.2);

  .btn-primary {
    width: auto;
    padding: 12px 5em;
  }
`;

type InputContainerType = {
  hasError?: boolean;
};
export const InputContainer = styled.div`
  margin-top: 15px;
  position: relative;

  input {
    border: ${(props: InputContainerType) =>
      props.hasError ? "2px solid red" : "none"};

    &:focus {
      outline: none;
    }
  }
`;

export const InputInfo = styled.span`
  display: block;
  margin-top: 0.2rem;

  opacity: 0.8;

  font-size: 0.8em;
`;
