import { useSigninCheck } from "reactfire";

import { RefiAuthUser, RefiError, RefiStatus } from "types/fire";
import { UserId } from "types/id";

type UseLoginCheck = () => {
  user?: RefiAuthUser;
  userId?: UserId;
  isLoading: boolean;
  isLoaded: boolean;
  status: RefiStatus;
  error: RefiError;
};

/**
 * @deprecated uses Reactfire and that library has bugs related to caching and users being logged out
 *
 * @see useUserId hook as a replacement
 */
export const useLoginCheck: UseLoginCheck = () => {
  const { status, data, error } = useSigninCheck();

  const user: RefiAuthUser | undefined = data?.user ?? undefined;
  const userId = user?.uid as UserId | undefined;

  const isLoading = "loading" === status;

  return { status, error, user, userId, isLoading, isLoaded: !isLoading };
};
