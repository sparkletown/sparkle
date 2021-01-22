import React from "react";

// Typings
import { RoomModalProps } from "./RoomModal.types";

// Styles
import * as S from "./RoomModal.styles";
import Item from "./Item";
import { useUser } from "hooks/useUser";
import { Modal } from "react-bootstrap";
import { ROOM_TEMPLATES } from "settings";

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
