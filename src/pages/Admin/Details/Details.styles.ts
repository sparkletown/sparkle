import styled from "styled-components";

export const DetailsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-areas: "form preview";
`;

export const DetailsFormWrapper = styled.div`
  grid-area: form;
`;

export const PreviewWrapper = styled.div`
  grid-area: preview;
`;
