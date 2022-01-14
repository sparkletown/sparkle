import { ReactNode, useEffect } from "react";

import { AdminNavBar } from "components/molecules/AdminNavBar";

import styles from "./AdminLayout.module.scss";

export interface AdminLayoutPropsType {
  children: ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutPropsType> = ({ children }) => {
  useEffect(() => {
    document.documentElement.classList.add(styles.html);
    document.body.classList.add("h-full");
    return () => {
      document.documentElement.classList.remove(styles.html);
      document.body.classList.remove("h-full");
    };
  }, []);

  return (
    <div>
      <AdminNavBar />
      {children}
    </div>
  );
};
