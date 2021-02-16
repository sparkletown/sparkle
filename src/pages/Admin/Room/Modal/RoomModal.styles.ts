import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  overflow-y: scroll;

  position: fixed;
  top: 0;
  left: 0;
  // @debt convert this to scss then use our z-index layer helper here
  z-index: 101;

  background: rgba(0, 0, 0, 0.5);
`;

export const InnerWrapper = styled.div`
  padding: 2rem 4rem;

  border-radius: 28px;
  background-color: #000;

  text-align: center;
`;

export const Title = styled.h1`
  margin-bottom: 0.5em;

  font-size: 2rem;
`;
