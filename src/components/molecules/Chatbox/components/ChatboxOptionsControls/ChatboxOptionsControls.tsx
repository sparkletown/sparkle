import React, { useCallback, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ChatMessageOptions, ChatOptionType } from "types/chat";

import { Dropdown } from "components/atoms/Dropdown";
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
        <div
          key={option.name}
          onClick={() => setActiveOption(option.type)}
          className="ChatboxOptionsControls__option"
          data-dropdown-value={option.name}
        >
          <span>{option.name}</span>
          <FontAwesomeIcon icon={option.icon} />
        </div>
      )),
    [setActiveOption]
  );

  const unselectOption = useCallback(
    () => setActiveOption(undefined),
    [setActiveOption]
  );

  return (
    <div className="ChatboxOptionsControls">
      {shouldShowPoll ? (
        <TextButton label="Cancel Poll" onClick={unselectOption} />
      ) : (
        <Dropdown
          title="Options"
          className="ChatboxOptionsControls__dropdown"
          placement="top"
          noArrow
        >
          {dropdownOptions}
        </Dropdown>
      )}
    </div>
  );
};
