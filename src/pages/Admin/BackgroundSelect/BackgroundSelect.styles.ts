import styled from "styled-components";

type WrapperProps = {
  backgroundUrl?: string;
  hasImage?: boolean;
};
export const Wrapper = styled.div<WrapperProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: ${({ hasImage }) => (hasImage ? "0" : "5rem 0 4rem")};

  position: relative;

  background-size: cover;
  background-color: #1a1d24;
  background-image: url(${({ backgroundUrl }) => backgroundUrl ?? ""});
  background-position: center;
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

export const Image = styled.img.attrs({
  alt: "Map background",
})`
  width: 100%;
`;
