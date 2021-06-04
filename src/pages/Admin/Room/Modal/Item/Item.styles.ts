import styled, { css } from "styled-components";

export const InnerWrapper = styled.div`
  display: none;

  padding: 1.5em 1em 1em;

  border-top: 1px solid #000;
`;

type WrapperProps = {
  isOpen: boolean;
};
export const Wrapper = styled.div<WrapperProps>`
  margin-bottom: 1rem;

  background-color: #1a1d24;
  border-radius: 28px;

  ${({ isOpen }) =>
    isOpen &&
    css`
      ${InnerWrapper} {
        display: block;
      }
    `}
`;

export const Title = styled.h1`
  margin-bottom: 0;

  font-size: 1.4rem;
`;

export const Description = styled.div`
  margin-bottom: 0;

  font-size: 1rem;
`;

export const TitleWrapper = styled.div`
  padding: 0 1rem;
  grid-area: title;

  text-align: left;
`;

export const Header = styled.div`
  display: grid;
  padding: 1em;
  grid-template-columns: 1fr 5fr 1fr;
  grid-template-areas: "icon title plus";
  align-items: center;

  svg {
    display: flex;
    justify-self: end;

    font-size: 3rem;

    cursor: pointer;
  }
`;

export const ItemIcon = styled.img`
  width: 100%;
  grid-area: icon;
  align-self: start;
`;

export const InputWrapper = styled.div`
  display: flex;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  align-items: flex-start;
  flex-direction: column;
`;

export const UrlToggleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const Flex = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
`;
