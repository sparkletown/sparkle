import styled, { css } from "styled-components";

export const Wrapper = styled.div`
  display: grid;
  width: 60%;
  margin: 6rem auto;
  grid-template-columns: repeat(4, 1fr);
  grid-template-areas:
    "chair_0 barrel barrel chair_1"
    "chair_2 barrel barrel chair_3"
    "chair_4 chair_5 chair_6 chair_7";
  grid-gap: 1rem;
`;

export const Barrel = styled.iframe.attrs({
  title: "FireBarrelVideo",
  frameBorder: "0",
  allow:
    "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture",
})`
  width: 80%;
  height: 80%;
  grid-area: barrel;
  align-self: center;
  justify-self: center;

  border-radius: 28px;
`;

type ChairProps = {
  chairNumber: number;
  isEmpty?: boolean;
};
const emptyChair = css`
  &:after {
    content: "+";
    font-size: 2rem;
  }
`;
export const Chair = styled.div<ChairProps>`
  display: flex;
  grid-area: chair_ ${({ chairNumber }) => chairNumber};
  justify-content: center;
  align-items: center;

  border-radius: 28px;

  background-color: #1a1d24;

  ${({ isEmpty }) => isEmpty && emptyChair};

  &:before {
    content: "";
    display: inline-block;
    width: 1px;
    height: 0;
    padding-bottom: calc(100% / (1 / 1));
  }

  video {
    width: 100%;
    height: 100%;
  }
`;
