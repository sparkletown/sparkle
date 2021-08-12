import React from "react";
import { Modal } from "react-bootstrap";

import { ROOM_TEMPLATES } from "settings";

import { useUser } from "hooks/useUser";

import Item from "./Item";
// Styles
import * as S from "./RoomModal.styles";
// Typings
import { RoomModalProps } from "./RoomModal.types";

const RoomModal: React.FC<RoomModalProps> = ({
  isVisible = false,
  venueId,
  onSubmitHandler,
  onClickOutsideHandler,
}) => {
  const { user } = useUser();

  if (!isVisible || !user) return null;

  return (
    <Modal show={isVisible} onHide={onClickOutsideHandler} size="lg">
      <S.InnerWrapper>
        <S.Title>Pick a room (type?)</S.Title>

        {ROOM_TEMPLATES.length > 0 &&
          ROOM_TEMPLATES.map((item) => (
            <Item
              {...item}
              key={item.name}
              venueId={venueId}
              user={user}
              onSubmitHandler={onSubmitHandler}
            />
          ))}
      </S.InnerWrapper>
    </Modal>
  );
};

export default RoomModal;
