import styled from "styled-components";

import { Button } from "components/atoms/Button/Button.styles";

export const Wrapper = styled.div`
  padding: 1rem;
  border-radius: ${(props) => props.theme.dimensions.borderRadius};
  background-color: ${(props) => props.theme.colors.gray};

  ${Button} {
    font-size: 0.8rem;
  }
`;

export const Header = styled.header`
  display: grid;
  grid-template-columns: 2fr repeat(4, 1fr) 3fr;
  grid-gap: 1rem;
  margin-bottom: 2rem;
`;

export const Banner = styled.div`
  img {
    width: 100%;
  }
`;

export const TitleWrapper = styled.div`
  display: flex;
  grid-column: 2 / span 4;
  flex-flow: column;
  flex-wrap: wrap;
`;

export const ButtonWrapper = styled.div`
  text-align: center;
`;

export const Title = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  font-style: italic;
`;

export const Description = styled.div`
  font-size: 0.8rem;
`;

export const EventWrapper = styled.div`
  margin-bottom: 1rem;
`;
