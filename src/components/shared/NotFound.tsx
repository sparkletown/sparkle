import React, { lazy } from "react";

import { tracePromise } from "utils/performance";

import { useAdminContextCheck } from "hooks/useAdminContextCheck";

// NOTE: lazy() is used for code splitting since admin and attendee sides load different style libraries

const AdminSide = lazy(() =>
  tracePromise("NotFound::lazy-import::AdminSide", () =>
    import("components/admin/errors/NotFound").then(({ NotFound }) => ({
      default: NotFound,
    }))
  )
);

// NOTE: lazy() is used for code splitting since admin and attendee sides load different style libraries

const AttendeeSide = lazy(() =>
  tracePromise("NotFound::lazy-import::AttendeeSide", () =>
    import("components/attendee/errors/NotFound").then(({ NotFound }) => ({
      default: NotFound,
    }))
  )
);

export const NotFound: React.FC = () => {
  const isAdminContext = useAdminContextCheck();
  return isAdminContext ? <AdminSide /> : <AttendeeSide />;
};
