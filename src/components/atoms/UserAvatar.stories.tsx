import { ComponentMeta, ComponentStory } from "@storybook/react";

import { UsernameVisibility } from "types/User";

import { UserAvatarPresentation } from "./UserAvatar/UserAvatar";

export default {
  title: "Atoms/UserAvatar",
  component: UserAvatarPresentation,
  argTypes: {
    onClick: { action: "clicked" },
  },
  args: {
    userDisplayName: "DiscoDonkey74",
    avatarSrc: "https://avatars.dicebear.com/api/pixel-art/donkey.svg",
    showNametag: UsernameVisibility.none,
  },
} as ComponentMeta<typeof UserAvatarPresentation>;

const Template: ComponentStory<typeof UserAvatarPresentation> = (args) => (
  <UserAvatarPresentation {...args} />
);

export const Primary = Template.bind({});
