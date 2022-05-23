import React, { useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dropdown } from "components/admin/Dropdown";

import { ChatMessageOptions, ChatOption, ChatOptionType } from "types/chat";

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

  const renderChatOption = (option: ChatOption) => (
    <div
      key={option.name}
      onClick={() => setActiveOption(option.type)}
      className="ChatboxOptionsControls__option"
      data-dropdown-value={option.name}
    >
      <span>{option.name}</span>
      <FontAwesomeIcon icon={option.icon} />
    </div>
  );

  const chatMessageOptions = ChatMessageOptions.map((option) => ({
    ...option,
    label: option.name,
  }));

  const unselectOption = useCallback(() => setActiveOption(undefined), [
    setActiveOption,
  ]);

  return (
    <div className="ChatboxOptionsControls">
      {shouldShowPoll ? (
        <TextButton label="Cancel Poll" onClick={unselectOption} />
      ) : (
        <Dropdown
          title="Options"
          options={chatMessageOptions}
          className="ChatboxOptionsControls__dropdown"
          placement="bottom"
          noArrow
          renderOption={renderChatOption}
        />
      )}
    </div>
  );
};
