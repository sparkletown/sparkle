import React from "react";

interface FullWidthLayoutProps {
  children: React.ReactNode;
}

// @debt This component should be moved in a src/components/admin/** directory
export const FullWidthLayout = ({ children }: FullWidthLayoutProps) => (
  <div className="max-w-12xl mx-auto py-6 px-4 sm:px-6 lg:px-8">{children}</div>
);
