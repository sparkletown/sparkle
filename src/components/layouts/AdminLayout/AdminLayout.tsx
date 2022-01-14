import { ReactNode, useEffect, useMemo, useState } from "react";
import { MenuIcon } from "@heroicons/react/outline";

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

  const [pageLayout, setPageLayout] = useState({ sidebarOpen: false });

  const setSidebarOpen = useMemo(
    () => (newValue: boolean) => setPageLayout({ sidebarOpen: newValue }),
    [setPageLayout]
  );

  return (
    <div>
      <AdminNavBar
        sidebarOpen={pageLayout.sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <div className="md:pl-56 flex flex-col flex-1">
        <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-100">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            onClick={() => {
              setPageLayout({ sidebarOpen: !pageLayout.sidebarOpen });
            }}
          >
            <span className="sr-only">Open sidebar</span>
            <MenuIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
};
