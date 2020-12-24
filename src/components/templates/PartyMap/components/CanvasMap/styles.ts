import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex: 1;
`;

export const Canvas = styled.div<{ height: string }>`
  width: 100%;
  height: ${(props) => props.height};
  flex: 1;
`;
export const SidebasePlace = styled.div`
  width: 280px;
`;
