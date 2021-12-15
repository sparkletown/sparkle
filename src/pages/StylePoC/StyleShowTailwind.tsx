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
import { AdminUserStatusInput } from "components/molecules/AdminUserStatusInput";
import { Loading } from "components/molecules/Loading";

import { ButtonNG } from "components/atoms/ButtonNG";
import { SpacesDropdown } from "components/atoms/SpacesDropdown";

import { AdminTextareaT } from "./components/AdminTextareaT";
import { PortalIconT } from "./components/PortalIconT";

import "./output.css";

export const StyleShowTailwind: React.FC = () => (
  <div className="StyleShowTailwind max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
    <AdminSection>
      <ButtonNG>ButtonNG</ButtonNG>
      <ButtonNG variant="primary">ButtonNG</ButtonNG>
      <ButtonNG variant="normal-gradient">ButtonNG</ButtonNG>
      <ButtonNG variant="login-outline">ButtonNG</ButtonNG>
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
      <PortalIconT src={PORTAL_INFO_LIST[1].icon} />
    </AdminSection>
    <AdminSection>
      <AdminInput
        label="Just a simple AdminInput"
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
