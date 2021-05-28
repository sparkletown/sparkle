import React, { useMemo } from "react";
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
  const showPoll = activeOption === ChatOptionType.poll;

  const dropdownOptions = useMemo(
    () =>
      Object.entries(ChatMessageOptions).map(([key, option]) => {
        const optionKey = key as ChatOptionType;

        return (
          <Dropdown.Item
            key={option.name}
            onClick={() => setActiveOption(optionKey)}
          >
            {option.name}
            <FontAwesomeIcon icon={option.icon} />
          </Dropdown.Item>
        );
      }),
    [setActiveOption]
  );

  return (
    <div className="ChatboxOptionsControls">
      {showPoll ? (
        <TextButton
          label="Cancel Poll"
          onClick={() => setActiveOption(undefined)}
        />
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
