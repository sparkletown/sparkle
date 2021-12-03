import React, { CSSProperties } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const StyledButton = styled.button<{
  hasGradient?: boolean;
}>`
  display: inline-block;
  padding: 0.75em 1em;

  border-radius: 1.375em;
  border: none;
  background-color: #6f43ff;
  background-image: ${({ hasGradient, disabled }) =>
    hasGradient && !disabled
      ? "linear-gradient(124deg, #00f6d5 0%, #6f43ff 50%, #e15ada 100%)"
      : "none"};

  color: #fff;
  font-size: 1rem;
  font-weight: 700;
  text-align: center;
  text-decoration: none;

  transform: translateY(0);

  transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1);
`;

interface LinkProps {
  isLink?: boolean;
  linkTo?: string;
}

export interface ButtonProps extends LinkProps {
  customClass?: string;
  customStyle?: CSSProperties;
  gradient?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: "button" | "reset" | "submit";
  disabled?: boolean;
  notPrimary?: boolean;
}

export const ButtonOG: React.FC<ButtonProps> = ({
  customClass,
  loading,
  onClick,
  type = "button",
  customStyle,
  children,
  gradient,
  isLink = false,
  linkTo,
  disabled = false,
}) => {
  if (loading)
    return (
      <div className="spinner-border">
        <span className="sr-only">Loading&hellip;</span>
      </div>
    );

  if (isLink && linkTo) {
    return (
      <StyledButton
        as={Link}
        className={customClass}
        style={customStyle}
        to={linkTo}
      >
        {children}
      </StyledButton>
    );
  }

  return (
    <StyledButton
      className={customClass}
      style={customStyle}
      type={type}
      onClick={onClick}
      hasGradient={gradient}
      disabled={disabled}
    >
      {children}
    </StyledButton>
  );
};
