import React, { useState } from "react";
import "firebase/storage";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

import { Venue_v2 } from "types/venues";

import { orderedVenuesSelector } from "utils/selectors";

import { useSelector } from "hooks/useSelector";
import { useUser } from "hooks/useUser";
import useRoles from "hooks/useRoles";
import { useIsAdminUser } from "hooks/roles";
import { useAdminVenues } from "hooks/useAdminVenues";

import { AuthOptions } from "components/organisms/AuthenticationModal/AuthenticationModal";
import { AdminVenues } from "components/organisms/AdminVenues/AdminVenues";
import { AdminVenueView } from "components/organisms/AdminVenueView";
import AuthenticationModal from "components/organisms/AuthenticationModal";
import { LoadingPage } from "components/molecules/LoadingPage";

import "./Admin.scss";
import * as S from "./Admin.styles";
import { WithId } from "utils/id";

dayjs.extend(advancedFormat);

const Admin_v2: React.FC = () => {
  const { user } = useUser();
  useAdminVenues(user?.uid);

  const [isCreatingVenue, setCreatingVenue] = useState<boolean>(false);
  const [selectedVenue, setSelectedVenue] = useState<WithId<Venue_v2> | null>();
  const venues = useSelector(orderedVenuesSelector);

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

  const selectVenue = (venue: WithId<Venue_v2>) => {
    setSelectedVenue(venue);
  };

  return (
    <>
      <S.Wrapper className="no-venue-selected">
        <S.ViewWrapper>
          {selectedVenue || isCreatingVenue ? (
            <AdminVenueView
              venue={selectedVenue as Venue_v2}
              onClickBackButton={() => {
                setCreatingVenue(false);
                setSelectedVenue(null);
              }}
            />
          ) : (
            <AdminVenues
              venues={venues as Venue_v2[]}
              onClickVenue={selectVenue}
              onClickCreateSpace={() => setCreatingVenue(true)}
            />
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
