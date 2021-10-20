import React, { useCallback, useMemo } from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ChatMessageOptions, ChatOptionType } from "types/chat";

import { TextButton } from "components/atoms/TextButton";

import "./ChatboxOptionsControls.scss";

export interface ChatboxOptionsControlsProps {
  activeOption?: ChatOptionType;
  setActiveOption: React.Dispatch<
    React.SetStateAction<ChatOptionType | undefined>
  >;
}

export const ChatboxOptionsControls: React.FC<ChatboxOptionsControlsProps> = ({
  activeOption,
  setActiveOption,
}) => {
  const shouldShowPoll = activeOption === ChatOptionType.poll;

  const dropdownOptions = useMemo(
    () =>
      ChatMessageOptions.map((option) => (
        <Dropdown.Item
          key={option.name}
          onClick={() => setActiveOption(option.type)}
        >
          {option.name}
          <FontAwesomeIcon icon={option.icon} />
        </Dropdown.Item>
      )),
    [setActiveOption]
  );

  const unselectOption = useCallback(() => setActiveOption(undefined), [
    setActiveOption,
  ]);

  return (
    <div className="ChatboxOptionsControls">
      {shouldShowPoll ? (
        <TextButton label="Cancel Poll" onClick={unselectOption} />
      ) : (
        <DropdownButton
          id="options-dropdown"
          title="Options"
          className="ChatboxOptionsControls__dropdown"
          variant="link"
          drop="up"
        >
          {dropdownOptions}
        </DropdownButton>
      )}
    </div>
  );
};
