import React from "react";

import {
  ALWAYS_EMPTY_OBJECT,
  ALWAYS_NOOP_FUNCTION,
  PORTAL_INFO_LIST,
  STRING_APOSTROPHE,
} from "settings";

import { AdminDateTime } from "components/molecules/AdminDateTime";
import { AdminInput } from "components/molecules/AdminInput";
import { AdminSection } from "components/molecules/AdminSection";
import { AdminTextarea } from "components/molecules/AdminTextarea";
import { AdminUserStatusInput } from "components/molecules/AdminUserStatusInput";
import { Loading } from "components/molecules/Loading";

import { PortalIcon } from "components/atoms/PortalIcon";
import { SpacesDropdown } from "components/atoms/SpacesDropdown";

import { AdminCheckboxM } from "./components/AdminCheckboxM";
import { ButtonM } from "./components/ButtonM";

export const StyleShowModule: React.FC = () => (
  <div className="StyleShowModule">
    <AdminSection>
      <ButtonM>ButtonM</ButtonM>
      <ButtonM variant="primary">ButtonM</ButtonM>
      <ButtonM variant="normal-gradient">ButtonM</ButtonM>
      <ButtonM variant="login-outline">ButtonM</ButtonM>
    </AdminSection>
    <AdminSection>
      <AdminCheckboxM
        variant="checkbox"
        name=""
        register={ALWAYS_NOOP_FUNCTION}
        label="Check, check check... One, two, three"
      />
      <AdminCheckboxM
        variant="toggler"
        name=""
        register={ALWAYS_NOOP_FUNCTION}
        label="just togglin'"
      />
      <AdminCheckboxM
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
