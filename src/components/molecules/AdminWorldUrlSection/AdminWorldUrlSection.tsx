import React, { useMemo } from "react";

import { WORLD_ROOT_URL } from "settings";

import { createUrlSafeName } from "api/admin";

import { isDefined } from "utils/types";

import "./AdminWorldUrlSection.scss";

export interface AdminWorldUrlSectionProps {
  name?: string;
  slug?: string;
}

export const AdminWorldUrlSection: React.FC<AdminWorldUrlSectionProps> = ({
  name,
  slug,
}) => {
  const host = window.location.host;
  const memoizedSlug = useMemo(
    () =>
      // if name is provided, it might be a preview for new slug, otherwise just reuse the old
      isDefined(name) ? createUrlSafeName(name) : slug ?? "",
    [slug, name]
  );

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
          /{memoizedSlug}
        </span>
      </p>
    </section>
  );
};
