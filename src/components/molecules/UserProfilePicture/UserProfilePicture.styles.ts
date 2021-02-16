import styled, { css, keyframes } from "styled-components";

import { DEFAULT_PROFILE_IMAGE } from "settings";

// --- Avatar
type AvatarProps = {
  backgroundImage?: string;
};
export const Avatar = styled.div<AvatarProps>`
  background-position: center;
  background-size: cover;
  width: 4vh;
  height: 4vh;
  background-image: url(${({ backgroundImage }) =>
    backgroundImage ?? DEFAULT_PROFILE_IMAGE});
`;

// --- Reaction
const reactionOffset = "-20px";
const reactionLeft = css`
  left: ${reactionOffset};
`;
const reactionRight = css`
  right: ${reactionOffset};
`;

type ReactionProps = {
  reactionPosition?: "right" | "left" | undefined;
};
export const Reaction = styled.div<ReactionProps>`
  width: 50px;

  position: absolute;
  ${({ reactionPosition }) =>
    reactionPosition === "right" ? reactionRight : reactionLeft};
  top: -25px;
  // @debt convert this to scss then use our z-index layer helper here
  z-index: 10;

  font-size: 50px;

  animation: pulse 4s ease-in-out infinite;
`;

// --- Reaction Container
export const Container = styled.div`
  height: 100%;
  position: relative;

  background-position: center;
  background-size: cover;
  // @debt convert this to scss then use our z-index layer helper here
  z-index: 10;

  ${Avatar} {
    border-radius: 10rem;
  }

  .on-right {
    ${Reaction} {
      right: unset;
      left: -20px;
    }
  }

  .profile-name-avatar {
    z-index: 1;
    bottom: 10%;
    position: absolute;
    margin: 0 auto;
    padding: 0px 5px;
    background-color: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(8px);
    border-radius: 18px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    text-align: center;
    font-size: 0.8rem;
    line-height: 0.9;
    opacity: 1;
    left: 50%;
    margin-right: -50%;
    transform: translate(-50%, 0);
    min-width: 70%;
  }
`;

// --- Shout-out message
const translateXOffset = "5vh"; // 5vh = imageWidth (4vh) + 1v (padding)
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

export const ShoutOutMessage = styled.div<ReactionProps>`
  width: max-content;
  max-width: 20em;
  padding: 6px 10px;

  position: absolute;
  bottom: 0;

  ${({ reactionPosition }) =>
    reactionPosition === "right" ? messageRight : messageLeft};

  background-color: rgba(255, 255, 255, 1);

  color: #000;
  font-size: 20px;
  border-radius: 10px;
`;
