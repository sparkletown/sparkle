import { ReactNode, useCallback, useEffect, useState } from "react";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Footer } from "components/admin/Footer";
import { Sidebar } from "components/admin/Sidebar";
import { AdminProfileModal } from "components/organisms/AdminProfileModal";

import "scss/admin/initial.scss";

export interface AdminLayoutPropsType {
  children: ReactNode;
}

const htmlClasses = "h-full bg-gray-100 js-focus-visible".split(" ");
const sidebarButtonClasses =
  "-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500";

export const AdminLayout: React.FC<AdminLayoutPropsType> = ({ children }) => {
  useEffect(() => {
    htmlClasses.map((htmlClass) =>
      document.documentElement.classList.add(htmlClass)
    );
    document.body.classList.add("h-full");

    return () => {
      htmlClasses.map((htmlClass) =>
        document.documentElement.classList.remove(htmlClass)
      );
      document.body.classList.remove("h-full");
    };
  }, []);

  const [pageLayout, setPageLayout] = useState({ sidebarOpen: false });

  const closeSidebar = useCallback(
    () => setPageLayout({ sidebarOpen: false }),
    []
  );

  const triggerSidebar = useCallback(() => {
    setPageLayout({ sidebarOpen: !pageLayout.sidebarOpen });
  }, [pageLayout.sidebarOpen]);

  return (
    <div className="AdminLayout">
      <Sidebar
        sidebarOpen={pageLayout.sidebarOpen}
        onCloseSidebar={closeSidebar}
      />
      <div className="md:pl-56 flex flex-col flex-1">
        <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-100">
          <button
            type="button"
            className={sidebarButtonClasses}
            onClick={triggerSidebar}
          >
            <span className="sr-only">Open sidebar</span>
            <FontAwesomeIcon className="h-6 w-6" icon={faBars} />
          </button>
        </div>
        <main className="flex-1">
          {children}
          <Footer />
        </main>
      </div>

      <AdminProfileModal />
    </div>
  );
};
