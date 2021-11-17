import { ComponentMeta, ComponentStory } from "@storybook/react";

import { ChatMessageInfoPure } from ".";

export default {
  title: "Atoms/ChatMessageInfo",
  component: ChatMessageInfoPure,
  argTypes: {
    deleteMessage: { action: "deleteMessage" },
    openAuthorProfile: { action: "openAuthorProfile" },
  },
  args: {
    userName: "DiscoStu74",
    userStatus: undefined,
    timestampMillis: 1637164323077, // ~17th November 2021 15:52
    reversed: false,
    avatarSrc: "https://avatars.dicebear.com/api/pixel-art/DiscoStu74.svg",
  },
} as ComponentMeta<typeof ChatMessageInfoPure>;

const Template: ComponentStory<typeof ChatMessageInfoPure> = (args) => (
  <ChatMessageInfoPure {...args} />
);

export const Primary = Template.bind({});
