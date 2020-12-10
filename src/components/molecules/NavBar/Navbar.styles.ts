import styled from "styled-components";

type RadioWrapperProps = {
  showRadioPopover: boolean;
};
export const RadioWrapper = styled.div<RadioWrapperProps>`
  position: absolute;
  top: 100%;
  right: 0;
  visibility: ${({ showRadioPopover }) =>
    showRadioPopover ? "visible" : "hidden"};
  user-select: ${({ showRadioPopover }) =>
    showRadioPopover ? "auto" : "none"};
`;

export const RadioTrigger = styled.div`
  position: relative;
  padding: 0.5em;
`;
