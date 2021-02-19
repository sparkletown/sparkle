import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
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
  max-width: 520px;

  border-radius: 1em;

  background-color: #000000;
  background-image: url(${(props: PreviewCardProps) => props.backgroundImage});
  background-position: center;
  background-size: cover;
  box-shadow: 0 10px 30px 0 rgba(0, 0, 0, 0.26);
`;

export const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Title = styled.h1`
  font-size: 2.4rem;
  font-style: italic;
  font-weight: 700;
  line-height: 1;
`;

export const Subtitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 400;
  line-height: 1;
`;

type LogoProps = {
  backgroundImage?: string;
};
export const Logo = styled.div`
  width: 6vw;
  height: 6vw;
  max-width: 120px;
  max-height: 120px;

  border-radius: 10rem;
  background-image: url(${(props: LogoProps) => props.backgroundImage});
  background-position: center;
  background-size: cover;
  background-color: #1a1d24;
`;

export const Description = styled.p`
  margin-bottom: 1rem;

  opacity: 0.7;

  font-size: 0.9rem;
`;
