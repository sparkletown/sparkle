import styled, { css } from "styled-components";

// -------------------- Outer Wrapper
export const OuterWrapper = styled.div`
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;

  position: sticky;
  top: 0;

  background-color: #1a1d24;
`;

// -------------------- Container
type ContainerProps = {
  backgroundImage?: string;
  large?: boolean;
};
const largeContainer = css<ContainerProps>`
  width: 100%;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 100%)),
    url(${({ backgroundImage }) => backgroundImage ?? "none"});
`;
const defaultContainer = css<ContainerProps>`
  width: 75%;
  background-image: url(${({ backgroundImage }) => backgroundImage ?? "none"});
`;
export const Container = styled.div<ContainerProps>`
  ${({ large }) => (large ? largeContainer : defaultContainer)};

  display: flex;
  padding: 6em 2em 2em;
  flex-direction: column;

  border-radius: 1em;

  background-size: cover;
  background-color: #000000;
  background-position: center;
  box-shadow: 0 10px 30px 0 rgba(0, 0, 0, 0.26);

  .btn {
    width: fit-content;
    padding: 0.5em 1em;
    align-self: flex-end;

    font-size: 0.8rem;
  }
`;

// -------------------- Title Wrapper
export const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

// -------------------- Title
export const Title = styled.h1`
  font-size: 2.4rem;
  font-style: italic;
  font-weight: 700;
  line-height: 1;
`;

// -------------------- Subtitle
export const Subtitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 400;
  line-height: 1;
`;

// -------------------- Description
export const Description = styled.p`
  margin-bottom: 1rem;

  opacity: 0.7;

  font-size: 0.9rem;
`;

// -------------------- Logo
type LogoProps = {
  backgroundImage?: string;
};
export const Logo = styled.div<LogoProps>`
  width: 6vw;
  height: 6vw;
  max-width: 120px;
  max-height: 120px;

  border-radius: 10rem;
  background-image: url(${({ backgroundImage }) => backgroundImage});
  background-position: center;
  background-size: cover;
  background-color: #1a1d24;
`;
