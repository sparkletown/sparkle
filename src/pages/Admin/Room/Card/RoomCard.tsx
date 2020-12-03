import React from "react";

import { RoomCardProps } from "./RoomCard.types";

import * as S from "./RoomCard.styles";
import Button from "components/atoms/Button";

const RoomCard: React.FC<any> = ({
  title,
  description,
  image_url,
  editHandler,
}) => {
  return (
    <S.Wrapper>
      <S.Header>
        <S.Banner>
          <img src={image_url} alt="Room banner" />
        </S.Banner>

        <S.TitleWrapper>
          <S.Title>{title}</S.Title>
          <S.Description>{description}</S.Description>
        </S.TitleWrapper>

        <S.ButtonWrapper>
          <Button text="Edit room" onClick={() => editHandler()} />
        </S.ButtonWrapper>
      </S.Header>

      <S.EventWrapper>No events yet</S.EventWrapper>
      <Button text="Add an event" />
    </S.Wrapper>
  );
};

export default RoomCard;
