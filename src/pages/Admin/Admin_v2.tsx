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

import { AdminVenues } from "components/organisms/AdminVenues/AdminVenues";
import { LoadingPage } from "components/molecules/LoadingPage";

import "./Admin.scss";
import * as S from "./Admin.styles";
import { AdminVenueView } from "components/organisms/AdminVenueView";

dayjs.extend(advancedFormat);

const Admin_v2: React.FC = () => {
  const { user } = useUser();
  useAdminVenues(user?.uid);

  const [selectedVenue, setSelectedVenue] = useState<Venue_v2 | null>()
  const [isCreatingVenue, setCreatingVenue] = useState<boolean>(false)

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

  return (
    <>
      <S.Wrapper className="no-venue-selected">
        <S.ItemWrapper>
          {selectedVenue || isCreatingVenue ? (
            <AdminVenueView
              onClickBackButton={() => {
                setCreatingVenue(false);
                setSelectedVenue(null);
              }}
            />
          ) : (
            <AdminVenues
              venues={venues as Venue_v2[]}
              onClickVenue={setSelectedVenue}
              onClickCreateSpace={() => setCreatingVenue(true)}
            />
          )}
        </S.ItemWrapper>
      </S.Wrapper>
    </>
  );
};

export default Admin_v2;
