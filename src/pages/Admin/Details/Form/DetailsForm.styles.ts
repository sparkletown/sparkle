import styled from "styled-components";
import { Form } from "react-bootstrap";

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

  div {
    fontSize: 20px;
    padding: 0.2rem;
  }

  input,textarea {
    border: ${(props: InputContainerType) =>
      props.hasError ? "2px solid red" : "none"};
      border: none;
      outline: none;
      background-color: rgba(255, 255, 255, 0.12);
      position: relative;
      cursor: pointer;
      width: 100%;
      max-width: 360px;
      font-size: 1em;
      padding: 12px;
      border-radius: 6px;
      text-align: left;
      color: #FFF;
      box-shadow: inset 0 0 0 1px rgb(255 255 255 / 10%);
      font-family: "Rubik", "HelveticaNeue", "Helvetica Neue", Helvetica, sans-serif;

      &:hover {
        box-shadow: inset 0 0 0 1px rgb(255 255 255 / 100%);
      }
  }

    &:focus {
      outline: none;
    }

  }
`;

export const BannerContainer = styled.div`
  margin: 15px 0;
  position: relative;
  border: none;
  outline: none;
  background-color: rgba(255, 255, 255, 0.12);
  position: relative;
  cursor: pointer;
  max-width: 360px;
  font-size: 1em;
  padding: 12px;
  border-radius: 6px;
  text-align: left;
  color: #fff;
  font-family: "Rubik", "HelveticaNeue", "Helvetica Neue", Helvetica, sans-serif;

  &:hover {
    box-shadow: inset 0 0 0 1px rgb(255 255 255 / 100%);
  }

  &:focus {
    outline: none;
  }
`;

export const LogoContainer = styled.div`
  border: solid transparent;
  background-color: rgba(255, 255, 255, 0.12);
  cursor: pointer;
  max-width: 180px;
  height: 180px;
  font-size: 1em;
  border-radius: 100%;

  &:hover {
    box-shadow: inset 0 0 0 1px rgb(255 255 255 / 100%);
  }

  &:focus {
    outline: none;
  }
`;

export const InputInfo = styled.span`
  display: block;
  margin-top: 0.2rem;

  opacity: 0.8;

  font-size: 0.8em;
`;
