import { useUserId } from "hooks/user/useUserId";

import { Loading } from "components/molecules/Loading";

import { ConversationSpace, ConversationSpaceProps } from "./ConversationSpace";

export const ConversationSpaceHoc: React.FC<
  Omit<ConversationSpaceProps, "userId">
> = (props) => {
  const { userId } = useUserId();

  if (!userId) {
    return <Loading />;
  }

  return <ConversationSpace userId={userId} {...props} />;
};
