import { ComponentMeta, ComponentStory } from "@storybook/react";

import { UsernameVisibility } from "types/User";

import { UserAvatarPresentation } from "./UserAvatar";

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
  decorators: [
    (Story) => (
      <div className="overflow-hidden py-3 pl-10 pr-3 border-t border-black border-opacity-10">
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof UserAvatarPresentation>;

const Template: ComponentStory<typeof UserAvatarPresentation> = (args) => (
  <UserAvatarPresentation {...args} />
);

export const Primary = Template.bind({});
