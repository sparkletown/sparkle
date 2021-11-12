import React, { ReactNode } from "react";

import { AdminSidebarSectionSubTitle } from "components/molecules/AdminSidebarSectionSubTitle";
import { AdminSidebarSectionTitle } from "components/molecules/AdminSidebarSectionTitle";

import "./AdminSection.scss";

export interface AdminSectionProps {
  title?: ReactNode | string;
  subtitle?: ReactNode | string;
  withLabel?: boolean;
}

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
