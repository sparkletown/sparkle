import React, { useCallback, useMemo } from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ChatMessageOptions, ChatOption } from "types/chat";

import { TextButton } from "components/atoms/TextButton";

import "./ChatboxOptionsControls.scss";

export interface ChatboxOptionsControlsProps {
  activeOption?: ChatOption;
  setActiveOption: React.Dispatch<React.SetStateAction<ChatOption | undefined>>;
}

export const ChatboxOptionsControls: React.FC<ChatboxOptionsControlsProps> = ({
  activeOption,
  setActiveOption,
}) => {
  const shouldShowPoll = activeOption === ChatMessageOptions.poll;

  const dropdownOptions = useMemo(
    () =>
      Object.values(ChatMessageOptions).map((option) => (
        <Dropdown.Item
          key={option.name}
          onClick={() => setActiveOption(option)}
        >
          {option.name}
          <FontAwesomeIcon icon={option.icon} />
        </Dropdown.Item>
      )),
    [setActiveOption]
  );

  const unSelectOption = useCallback(() => setActiveOption(undefined), [
    setActiveOption,
  ]);

  return (
    <div className="ChatboxOptionsControls">
      {shouldShowPoll ? (
        <TextButton label="Cancel Poll" onClick={unSelectOption} />
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
