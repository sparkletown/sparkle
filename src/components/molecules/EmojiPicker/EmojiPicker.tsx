import React from "react";

import { EmojiData, Picker } from "emoji-mart";

import "emoji-mart/css/emoji-mart.css";

export interface EmojiPickerProps {
  onSelect: (emoji: EmojiData) => void;
}

export const EmojiPicker: React.FC<EmojiPickerProps> = ({ onSelect }) => {
  return <Picker theme={"dark"} onSelect={onSelect} native />;
};
