import { withAuth } from "components/hocs/db/withAuth";
import { withProfile } from "components/hocs/db/withProfile";
import { withRequired } from "components/hocs/gate/withRequired";
import { compose } from "lodash/fp";

export const withUser = compose(withAuth, withRequired(["auth"]), withProfile);

// export const withUser = <T = {}>(Component: React.FC<T>) => {
//   const WithUser = (props: PropsWithChildren<T>) => {
//     const {
//       authError,
//       profileError,
//       isLoading,
//       user,
//       userId,
//       profile,
//       userWithId,
//       userLocation,
//       isTester,
//     } = useUser();
//
//     const memoizedProps = useMemo(
//       () => ({
//         ...props,
//         isUserLoading: isLoading,
//         auth: user,
//         userId,
//         profile,
//         userWithId,
//         userLocation,
//         isTester,
//       }),
//       [
//         props,
//         isLoading,
//         user,
//         userId,
//         profile,
//         userWithId,
//         userLocation,
//         isTester,
//       ]
//     );
//
//     if (authError || profileError) {
//       // @debt add Bugsnag here
//       console.error(withUser.name, authError, profileError);
//       return null;
//     }
//
//     return React.createElement(Component, memoizedProps);
//   };
//
//   hoistHocStatics("withUser", WithUser, Component);
//   return WithUser;
// };
