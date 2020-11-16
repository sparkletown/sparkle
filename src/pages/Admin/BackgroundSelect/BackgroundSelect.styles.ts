import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 5rem 0 4rem;

  position: relative;

  border-radius: 1.8rem;
  background-color: #1a1d24;
`;

export const MapBrowserGrid = styled.div`
  display: grid;
  width: 50%;
  grid-gap: 1rem;
  grid-template-columns: repeat(3, 1fr);
`;

type MapItemProps = {
  backgroundImage: string;
  aspectRatio?: string;
};
export const MapItem = styled.div<MapItemProps>`
  padding-bottom: calc(100% / (${({ aspectRatio }) => aspectRatio ?? 2 / 1}));

  border-radius: 1.8em;

  background: #000;
  background-size: cover;
  background-image: url(${({ backgroundImage }) => backgroundImage});
  background-position: center;

  cursor: pointer;
`;
