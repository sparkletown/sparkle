import React from "react";

import { SetSelectedProfile } from "types/chat";

import "./Twitter.scss";

export interface VenueChatProps {
  onAvatarClick: SetSelectedProfile;
}

export const Twitter: React.FC<VenueChatProps> = ({ onAvatarClick }) => {
  return (
    <div className="venue-chat">
      <a
        href="https://twitter.com/intent/tweet?button_hashtag=LoveTwitter&ref_src=twsrc%5Etfw"
        className="twitter-hashtag-button"
        data-show-count="true"
      >
        Tweet #LoveTwitter
      </a>
      <script async src="https://platform.twitter.com/widgets.js"></script>
    </div>
  );
};
