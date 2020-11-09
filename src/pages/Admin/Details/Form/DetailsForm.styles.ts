import styled from "styled-components";

export const Form = styled.form`
  position: relative;
`;

export const FormInnerWrapper = styled.div`
  padding: 3em 5em;
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
