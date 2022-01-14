import { useSigninCheck } from "reactfire";

import { UserId } from "types/id";
import { RefiAuthUser, RefiError, RefiStatus } from "types/reactfire";

type UseLoginCheck = () => {
  user?: RefiAuthUser;
  userId?: UserId;
  isLoading: boolean;
  isLoaded: boolean;
  status: RefiStatus;
  error: RefiError;
};

export const useLoginCheck: UseLoginCheck = () => {
  const { status, data, error } = useSigninCheck();

  const user: RefiAuthUser | undefined = data?.user ?? undefined;
  const userId = user?.uid as UserId;

  const isLoading = "loading" === status;

  return { status, error, user, userId, isLoading, isLoaded: !isLoading };
};
