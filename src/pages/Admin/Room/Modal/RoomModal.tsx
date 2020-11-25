import React, { useRef } from "react";

// Typings
import { RoomModalProps } from "./RoomModal.types";

// Styles
import * as S from "./RoomModal.styles";
import Item from "./Item";
import { faSquare } from "@fortawesome/free-regular-svg-icons";
import { faVideo } from "@fortawesome/free-solid-svg-icons";
import { useUser } from "hooks/useUser";
import { useClickOutside } from "hooks/useClickOutside";

const templateTypes = [
  {
    name: "Conversation Room",
    description: "Simple Room to chat",
    icon: faSquare,
  },
  {
    name: "Auditorium",
    description: "A central scene to gather a large crowd",
    icon: faVideo,
  },
];

const RoomModal: React.FC<RoomModalProps> = ({
  isVisible = false,
  venueId,
  onSubmitHandler,
  onClickOutsideHandler,
}) => {
  const { user } = useUser();

  const innerWrapperRef = useRef(null);

  useClickOutside(innerWrapperRef, onClickOutsideHandler);

  if (!isVisible) return <></>;

  return (
    <S.Wrapper>
      <S.InnerWrapper ref={innerWrapperRef}>
        <S.Title>Pick a room (type?)</S.Title>

        {templateTypes.length > 0 &&
          templateTypes.map((item) => (
            <Item
              {...item}
              key={item.name}
              venueId={venueId}
              user={user}
              onSubmitHandler={onSubmitHandler}
            />
          ))}
      </S.InnerWrapper>
    </S.Wrapper>
  );
};

export default RoomModal;
