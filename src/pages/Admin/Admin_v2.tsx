import React from "react";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

import { useOwnedVenues } from "hooks/useConnectOwnedVenues";
import { useRoles } from "hooks/useRoles";
import { useUser } from "hooks/useUser";

import { AdminVenues } from "components/organisms/AdminVenues/AdminVenues";
import {
  AuthenticationModal,
  AuthOptions,
} from "components/organisms/AuthenticationModal";

import { LoadingPage } from "components/molecules/LoadingPage";

import { AdminRestricted } from "components/atoms/AdminRestricted";

import "firebase/storage";

import * as S from "./Admin.styles";

import "./Admin.scss";

dayjs.extend(advancedFormat);

const Admin_v2: React.FC = () => {
  const { user } = useUser();

  const { ownedVenues, isLoading } = useOwnedVenues({});

  const { roles } = useRoles();

  if (isLoading || !roles) {
    return <LoadingPage />;
  }

  if (!user) {
    return <>You need to log in first.</>;
  }

  return (
    <AdminRestricted>
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
    </AdminRestricted>
  );
};

export default Admin_v2;
