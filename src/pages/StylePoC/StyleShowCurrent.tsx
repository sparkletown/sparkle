import React from "react";

import {
  ALWAYS_EMPTY_OBJECT,
  ALWAYS_NOOP_FUNCTION,
  PORTAL_INFO_LIST,
  STRING_APOSTROPHE,
} from "settings";

import { AdminCheckbox } from "components/molecules/AdminCheckbox";
import { AdminDateTime } from "components/molecules/AdminDateTime";
import { AdminInput } from "components/molecules/AdminInput";
import { AdminSection } from "components/molecules/AdminSection";
import { AdminTextarea } from "components/molecules/AdminTextarea";
import { AdminUserStatusInput } from "components/molecules/AdminUserStatusInput";
import { Loading } from "components/molecules/Loading";

import { ButtonNG } from "components/atoms/ButtonNG";
import { PortalIcon } from "components/atoms/PortalIcon";
import { SpacesDropdown } from "components/atoms/SpacesDropdown";

export const StyleShowCurrent: React.FC = () => (
  <div className="StyleShowCurrent">
    <AdminSection>
      <ButtonNG>ButtonNG</ButtonNG>
      <ButtonNG variant="primary">ButtonNG</ButtonNG>
      <ButtonNG variant="normal-gradient">ButtonNG</ButtonNG>
      <ButtonNG variant="login-outline">ButtonNG</ButtonNG>
      <ButtonNG variant="danger">ButtonNG</ButtonNG>
    </AdminSection>
    <AdminSection>
      <AdminCheckbox
        variant="checkbox"
        name=""
        register={ALWAYS_NOOP_FUNCTION}
        label="Check, check check... One, two, three"
      />
      <AdminCheckbox
        variant="toggler"
        name=""
        register={ALWAYS_NOOP_FUNCTION}
        label="just togglin'"
      />
      <AdminCheckbox
        variant="flip-switch"
        name=""
        register={ALWAYS_NOOP_FUNCTION}
        displayOn="🔥 It is ON"
        displayOff="It is OFF ❄"
      />
    </AdminSection>
    <AdminSection>
      <Loading label="Hey, look at me, I'm looooadiiin'" />
      <PortalIcon src={PORTAL_INFO_LIST[1].icon} />
    </AdminSection>
    <AdminSection>
      <AdminInput
        label="Just a simple AdminInput"
        name=""
        register={ALWAYS_NOOP_FUNCTION}
      />
      <AdminTextarea
        placeholder="and an AdminTextarea"
        name=""
        register={ALWAYS_NOOP_FUNCTION}
      />
    </AdminSection>
    <AdminSection>
      <AdminDateTime name="" register={ALWAYS_NOOP_FUNCTION} />
      <AdminUserStatusInput name="" register={ALWAYS_NOOP_FUNCTION} />
    </AdminSection>
    <AdminSection>
      NB: Not our component, {STRING_APOSTROPHE}twas Bootstrap
      <SpacesDropdown
        setValue={ALWAYS_NOOP_FUNCTION}
        register={ALWAYS_NOOP_FUNCTION}
        fieldName=""
        spaces={ALWAYS_EMPTY_OBJECT}
      />
    </AdminSection>
  </div>
);
