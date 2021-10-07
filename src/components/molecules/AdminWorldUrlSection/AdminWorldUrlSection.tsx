import React, { useMemo } from "react";

import { WORLD_ROOT_URL } from "settings";

import { createUrlSafeName } from "api/admin";

import "./AdminWorldUrlSection.scss";

export interface AdminWorldUrlSectionProps {
  name?: string;
}

export const AdminWorldUrlSection: React.FC<AdminWorldUrlSectionProps> = ({
  name,
}) => {
  const host = window.location.host;
  const slug = useMemo(() => (name ? createUrlSafeName(name) : ""), [name]);

  return (
    <section className="AdminWorldUrlSection">
      <p className="AdminWorldUrlSection__label">The URL of your world is:</p>
      <p>
        <span className="AdminWorldUrlSection__segment AdminWorldUrlSection__host">
          {host}
        </span>
        <span className="AdminWorldUrlSection__segment AdminWorldUrlSection__root">
          {WORLD_ROOT_URL}
        </span>
        <span className="AdminWorldUrlSection__segment AdminWorldUrlSection__id">
          /{slug}
        </span>
      </p>
    </section>
  );
};
