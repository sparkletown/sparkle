import React, { ReactNode } from "react";

import { AdminSidebarSectionSubTitle } from "components/organisms/AdminVenueView/components/AdminSidebarSectionSubTitle";
import { AdminSidebarSectionTitle } from "components/organisms/AdminVenueView/components/AdminSidebarSectionTitle";

import "./AdminSection.scss";

export interface AdminSectionProps {
  title?: ReactNode | string;
  subtitle?: ReactNode | string;
  withLabel?: boolean;
}

/**
 * @deprecated Use InputGroup component instead.
 * @see src/components/admin/InputGroup/
 */
export const AdminSection: React.FC<AdminSectionProps> = ({
  title,
  subtitle,
  withLabel = false,
  children,
}) => {
  const contents = (
    <>
      {title && <AdminSidebarSectionTitle>{title}</AdminSidebarSectionTitle>}
      {subtitle && (
        <AdminSidebarSectionSubTitle>{subtitle}</AdminSidebarSectionSubTitle>
      )}
      {children}
    </>
  );

  return (
    <section className="AdminSection">
      {withLabel ? (
        <label className="AdminSection__label">{contents}</label>
      ) : (
        contents
      )}
    </section>
  );
};
