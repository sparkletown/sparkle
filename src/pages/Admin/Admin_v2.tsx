import React from "react";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

import { useIsAdminUser } from "hooks/roles";
import { useOwnedVenues } from "hooks/useConnectOwnedVenues";
import { useRoles } from "hooks/useRoles";
import { useUser } from "hooks/useUser";

import { AdminVenues } from "components/organisms/AdminVenues/AdminVenues";
import {
  AuthenticationModal,
  AuthOptions,
} from "components/organisms/AuthenticationModal";

import { LoadingPage } from "components/molecules/LoadingPage";

import "firebase/storage";

import * as S from "./Admin.styles";

import "./Admin.scss";

dayjs.extend(advancedFormat);

const Admin_v2: React.FC = () => {
  const { user } = useUser();

  const { ownedVenues, isLoading } = useOwnedVenues({});

  const { roles } = useRoles();

  const { isAdminUser } = useIsAdminUser(user?.uid);

  if (isLoading || !roles) {
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
          <AdminVenues venues={ownedVenues} />
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
