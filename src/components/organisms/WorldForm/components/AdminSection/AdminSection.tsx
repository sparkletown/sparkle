import React from "react";

import { AdminSidebarSectionTitle } from "components/organisms/AdminVenueView/components/AdminSidebarSectionTitle";

import "./AdminSection.scss";

export interface AdminSectionProps {
  title?: string;
}

export const AdminSection: React.FC<AdminSectionProps> = ({
  title,
  children,
}) => {
  return (
    <section className="AdminSection">
      {title && <AdminSidebarSectionTitle>{title}</AdminSidebarSectionTitle>}
      {children}
    </section>
  );
};
