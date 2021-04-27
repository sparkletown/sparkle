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
  padding: 1rem 0;
`;

export const MapBrowserGrid = styled.div`
  display: -webkit-box;
  flex-flow: row;
  padding: 0.5em 0;
  overflow-x: scroll;

  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    background-color: rgba(0, 0, 0);
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: rgba(255, 255, 255, 0.3);
  }
`;

type MapItemProps = {
  backgroundImage: string;
  aspectRatio?: string;
};
export const MapItem = styled.div<MapItemProps>`
  flex-grow: 0;
  width: 58px;
  height: 58px;
  margin: 0 5px;
  cursor: pointer;
  border-radius: 1em;
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
