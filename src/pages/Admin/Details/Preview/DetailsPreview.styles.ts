import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;

  position: sticky;
  top: 0;

  background-color: #1a1d24;
`;

type PreviewCardProps = {
  backgroundImage?: string;
};
export const PreviewCard = styled.div`
  display: flex;
  width: 75%;
  flex-direction: column;
  padding: 6em 2em 2em;

  background-color: #000000;
  background-image: url(${(props: PreviewCardProps) => props.backgroundImage});
  background-position: center;
  background-size: cover;
  border-radius: 1em;
`;

export const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Title = styled.h1`
  font-size: 2rem;
  font-style: italic;
`;

export const Subtitle = styled.h2`
  font-size: 1.2rem;
`;

type LogoProps = {
  backgroundImage?: string;
};
export const Logo = styled.div`
  width: 5vw;
  height: 5vw;
  max-width: 160px;
  max-height: 160px;

  border-radius: 10rem;
  background-image: url(${(props: LogoProps) => props.backgroundImage});
  background-position: center;
  background-size: cover;
  background-color: #1a1d24;
`;
