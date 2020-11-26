import styled from "styled-components";

// Components
import { Button } from "components/atoms/Button/Button.styles";

export const InnerWrapper = styled.div`
  padding: 2rem 4rem;

  border-radius: ${(props) => props.theme.dimensions.borderRadius};
  background-color: ${(props) => props.theme.colors.black};

  text-align: center;

  ${Button} {
    display: block;
    width: 100%;
    margin-top: 4rem;
  }
`;

// -------------------- MODAL TITLE
export const Title = styled.h1`
  margin-bottom: 0.5em;

  font-size: 2rem;
`;

// -------------------- INPUT WRAPPER
export const InputWrapper = styled.div`
  display: flex;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  align-items: flex-start;
`;

export const Error = styled.span`
  color: ${(props) => props.theme.colors.warning};
`;

export const InputTitle = styled.h2`
  font-size: 1rem;
`;

export const InputLabel = styled.span`
  margin-right: 1em;
  font-size: 0.8rem;
`;

export const InputInline = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 1rem;
  align-items: center;
  justify-content: center;
`;
