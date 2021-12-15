import React from "react";

import {
  ALWAYS_EMPTY_OBJECT,
  ALWAYS_NOOP_FUNCTION,
  PORTAL_INFO_LIST,
  STRING_APOSTROPHE,
} from "settings";

import { AdminDateTime } from "components/molecules/AdminDateTime";
import { AdminSection } from "components/molecules/AdminSection";
import { AdminUserStatusInput } from "components/molecules/AdminUserStatusInput";
import { Loading } from "components/molecules/Loading";

import { SpacesDropdown } from "components/atoms/SpacesDropdown";

import { AdminCheckboxT } from "./components/AdminCheckboxT";
import { AdminInputT } from "./components/AdminInputT";
import { AdminTextareaT } from "./components/AdminTextareaT";
import { ButtonT } from "./components/ButtonT";
import { PortalIconT } from "./components/PortalIconT";

import "./StyleShowTailwind.scss";

export const StyleShowTailwind: React.FC = () => (
  <div className="StyleShowTailwind bg-gray-100">
    <AdminSection>
      <ButtonT>ButtonT</ButtonT>
      <ButtonT variant="primary">ButtonT</ButtonT>
      <ButtonT variant="normal-gradient">ButtonT</ButtonT>
      <ButtonT variant="login-outline">ButtonT</ButtonT>
      <ButtonT variant="danger">ButtonT</ButtonT>
    </AdminSection>
    <AdminSection>
      <AdminCheckboxT
        variant="checkbox"
        name=""
        register={ALWAYS_NOOP_FUNCTION}
        label="Check, check check... One, two, three"
      />
      <AdminCheckboxT
        variant="toggler"
        name=""
        register={ALWAYS_NOOP_FUNCTION}
        label="just togglin'"
      />
      <AdminCheckboxT
        variant="flip-switch"
        name=""
        register={ALWAYS_NOOP_FUNCTION}
        displayOn="🔥 It is ON"
        displayOff="It is OFF ❄"
      />
    </AdminSection>
    <AdminSection>
      <Loading label="Hey, look at me, I'm looooadiiin'" />
      <PortalIconT src={PORTAL_INFO_LIST[1].icon} />
    </AdminSection>
    <AdminSection>
      <AdminInputT
        label="Just a simple AdminInputT"
        name=""
        register={ALWAYS_NOOP_FUNCTION}
      />
      <AdminTextareaT
        placeholder="and an AdminTextareaT"
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
