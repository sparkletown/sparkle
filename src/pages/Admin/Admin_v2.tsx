import React, { useMemo } from "react";
import "firebase/storage";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

import { orderedVenuesSelector } from "utils/selectors";

import { useSelector } from "hooks/useSelector";
import { useUser } from "hooks/useUser";
import useRoles from "hooks/useRoles";
import { useIsAdminUser } from "hooks/roles";
import { useAdminVenues } from "hooks/useAdminVenues";
import { useVenueId } from "hooks/useVenueId";

import { AdminVenues } from "components/organisms/AdminVenues/AdminVenues";
import { AdminVenueView } from "components/organisms/AdminVenueView";
import {
  AuthenticationModal,
  AuthOptions,
} from "components/organisms/AuthenticationModal";
import { LoadingPage } from "components/molecules/LoadingPage";

import "./Admin.scss";
import * as S from "./Admin.styles";

dayjs.extend(advancedFormat);

const Admin_v2: React.FC = () => {
  const { user } = useUser();
  useAdminVenues(user?.uid);

  // @debt This selector relies on all venues in firebase being loaded into memory.. not very efficient
  const venues = useSelector(orderedVenuesSelector);

  const venueId = useVenueId();

  const selectedVenue = useMemo(() => venues?.find((v) => v.id === venueId), [
    venueId,
    venues,
  ]);

  const { roles } = useRoles();

  const { isAdminUser } = useIsAdminUser(user?.uid);

  if (!venues || !roles) {
    return <LoadingPage />;
  }

  if (!user) {
    return <>You need to log in first.</>;
  }

  if (!roles.includes("admin") || !isAdminUser) {
    return <>Forbidden</>;
  }

  return (
    <>
      <S.Wrapper className="no-venue-selected">
        <S.ViewWrapper>
          {selectedVenue ? (
            // @debt Venue_v2 has different structure than AnyVenue, 1 of them should be deprecated.
            <AdminVenueView />
          ) : (
            <AdminVenues venues={venues} />
          )}
        </S.ViewWrapper>
      </S.Wrapper>

      <AuthenticationModal
        show={!user}
        onHide={() => {}}
        showAuth={AuthOptions.login}
      />
    </>
  );
};

export default Admin_v2;
