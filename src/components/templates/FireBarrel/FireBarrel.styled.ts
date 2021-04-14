import styled, { css } from "styled-components";

export const Wrapper = styled.div`
  display: grid;
  width: 60%;
  margin: 6rem auto;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 1rem;
`;

export const Barrel = styled.iframe.attrs({
  title: "FireBarrelVideo",
  frameBorder: "0",
  allow:
    "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture",
})`
  width: 100%;
  height: 100%;
  grid-column: 2 / span 2;
  grid-row: 1 / span 2;
  align-self: center;
  justify-self: center;

  border-radius: 28px;
`;

type ChairProps = {
  isEmpty?: boolean;
};
const emptyChair = css`
  &:after {
    content: "+";
    font-size: 2rem;
  }
`;
const filledChair = css`
  background-color: unset;
`;
export const Chair = styled.div<ChairProps>`
  display: flex;
  justify-content: center;
  align-items: center;

  position: relative;

  border-radius: 28px;

  background-color: #1a1d24;

  overflow: hidden;

  ${({ isEmpty }) => (isEmpty ? emptyChair : filledChair)};

  &:before {
    content: "";
    display: inline-block;
    width: 1px;
    height: 0;
    padding-bottom: calc(100% / (1 / 1));
  }

  .col {
    width: 100%;
    height: 100%;
    padding: 0;
  }

  .mute-container {
    position: absolute;
    bottom: 15%;
    left: 0.5em;
  }

  .mute-other-container {
    position: absolute;
    bottom: 15%;
    right: 0.5em;
  }

  video {
    width: 100%;
    height: 100%;

    border-radius: 28px;
  }

  .participant {
    position: relative;
  }

  .av-controls {
    display: flex;
    justify-content: space-around;
    margin: 4px;

    position: absolute;
    right: 0;
    bottom: 1em;
    left: 0;

    text-align: center;
  }
`;
