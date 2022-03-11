import { useUser } from "hooks/useUser";

import { Loading } from "components/molecules/Loading";

import { ConversationSpace, ConversationSpaceProps } from "./ConversationSpace";

export const ConversationSpaceHoc: React.FC<
  Omit<ConversationSpaceProps, "userId">
> = (props) => {
  const { userId } = useUser();

  if (!userId) {
    return <Loading />;
  }

  return <ConversationSpace userId={userId} {...props} />;
};
