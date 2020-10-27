import styled, { css, keyframes } from "styled-components";

// --- Avatar
type TAvatar = {
  backgroundImage?: string;
};
export const Avatar = styled.div`
  background-position: center;
  background-size: cover;
  width: 4vh;
  height: 4vh;
  background-image: url(${(props: TAvatar) => props?.backgroundImage ?? ""});
`;

// --- Reaction
const reactionOffset = "-20px";
const reactionLeft = css`
  left: ${reactionOffset};
`;
const reactionRight = css`
  right: ${reactionOffset};
`;

type TReaction = {
  reactionPosition?: "right" | "left" | undefined;
};
export const Reaction = styled.div`
  width: 50px;

  position: absolute;
  ${(props: TReaction) =>
    props.reactionPosition === "right" ? reactionRight : reactionLeft};
  top: -25px;
  z-index: 1000;

  font-size: 50px;

  animation: pulse 4s ease-in-out infinite;
`;

// --- Reaction Container
export const Container = styled.div`
  width: 100%;
  height: 100%;
  position: relative;

  ${Avatar} {
    border-radius: 10rem;
  }

  .on-right {
    ${Reaction} {
      right: unset;
      left: -20px;
    }
  }
`;

// --- Shout-out message

const translateXOffset = '5vh'; // 5vh = imageWidth (4vh) + 1v (padding)
const expandBounceRight = keyframes`
  0%,
  100% {
    transform: scale(0) translateX(0);
  }

  25% {
    transform: scale(1.25) translateX(${translateXOffset});
  }

  40%,
  80% {
    transform: scale(1) translateX(${translateXOffset});
  }
`;
const expandBounceLeft = keyframes`
  0%,
  100% {
    transform: scale(0) translateX(0);
  }

  25% {
    transform: scale(1.25) translateX(-${translateXOffset});
  }

  40%,
  80% {
    transform: scale(1) translateX(-${translateXOffset});
  }
`;

const messageLeft = css`
  right: 0;
  transform-origin: right center;
  animation: ${expandBounceLeft} 5s ease;
`;
const messageRight = css`
  left: 0;
  transform-origin: 2vh center;
  animation: ${expandBounceRight} 5s ease;
`;

export const ShoutOutMessage = styled.div`
  width: max-content;
  max-width: 20em;
  padding: 6px 10px;

  position: absolute;
  top: 0;

  ${(props: TReaction) =>
    props.reactionPosition === "right" ? messageRight : messageLeft};

  background-color: ${(props) => props.theme.fadedWhite};

  color: ${(props) => props.theme.black};
  font-size: 20px;
  border-radius: 10px;

`;
