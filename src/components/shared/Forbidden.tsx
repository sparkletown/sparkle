import React, { lazy } from "react";

import { tracePromise } from "utils/performance";

import { useAdminContextCheck } from "hooks/useAdminContextCheck";

// NOTE: lazy() is used for code splitting since admin and attendee sides load different style libraries

const AdminSide = lazy(() =>
  tracePromise("Forbidden::lazy-import::AdminSide", () =>
    import("components/admin/errors/Forbidden").then(({ Forbidden }) => ({
      default: Forbidden,
    }))
  )
);

// NOTE: lazy() is used for code splitting since admin and attendee sides load different style libraries

const AttendeeSide = lazy(() =>
  tracePromise("Forbidden::lazy-import::AttendeeSide", () =>
    import("components/attendee/errors/Forbidden").then(({ Forbidden }) => ({
      default: Forbidden,
    }))
  )
);

export const Forbidden: React.FC = () => {
  const isAdminContext = useAdminContextCheck();
  return isAdminContext ? <AdminSide /> : <AttendeeSide />;
};
