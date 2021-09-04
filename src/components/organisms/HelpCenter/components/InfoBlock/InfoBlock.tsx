import React from "react";

import { ButtonNG } from "components/atoms/ButtonNG";

import "./InfoBlock.scss";

export interface InfoBlockProps {
  column: number;
  imgSrc: string;
  title: string;
  buttonText: string;
  text: string;
  onClick: () => void;
}

export const InfoBlock: React.FC<InfoBlockProps> = ({
  column,
  imgSrc,
  title,
  buttonText,
  text,
  onClick,
}) => {
  return (
    <>
      <div className={`InfoBlock__header--${column}`}>
        <img src={imgSrc} className="InfoBlock__img" alt="badge" />
        <h4>{title}</h4>
      </div>
      <div className={`InfoBlock__text--${column}`}>{text}</div>
      <ButtonNG
        className={`InfoBlock__button--${column}`}
        variant="primary"
        onClick={onClick}
      >
        {buttonText}
      </ButtonNG>
    </>
  );
};
