export interface ProfileModalSectionHeaderProps {
  text: string;
}

export const ProfileModalSectionHeader: React.FC<ProfileModalSectionHeaderProps> = ({
  text,
}) => {
  return <div data-bem="ProfileModalSectionHeader">{text}</div>;
};
