import React, { Suspense, lazy } from "react";

import { EmojiData } from "emoji-mart";

import { tracePromise } from "utils/performance";

import { Loading } from "components/molecules/Loading";

import "emoji-mart/css/emoji-mart.css";

const Picker = lazy(() =>
  tracePromise("EmojiPicker::lazy-import::emoji-mart", () =>
    import("emoji-mart").then(({ Picker }) => ({
      default: Picker,
    }))
  )
);

export interface EmojiPickerProps {
  onSelect: (emoji: EmojiData) => void;
}

export const EmojiPicker: React.FC<EmojiPickerProps> = ({ onSelect }) => (
  <Suspense fallback={<Loading />}>
    <Picker theme="dark" onSelect={onSelect} native />
  </Suspense>
);
