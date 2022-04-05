import React, { lazy } from "react";

import { tracePromise } from "utils/performance";

import { useAdminContextCheck } from "hooks/useAdminContextCheck";

// NOTE: lazy() is used for code splitting since admin and attendee sides load different style libraries

const AdminSide = lazy(() =>
  tracePromise("Unauthorized::lazy-import::AdminSide", () =>
    import("components/admin/errors/Unauthorized").then(({ Unauthorized }) => ({
      default: Unauthorized,
    }))
  )
);

// NOTE: lazy() is used for code splitting since admin and attendee sides load different style libraries

const AttendeeSide = lazy(() =>
  tracePromise("Unauthorized::lazy-import::AttendeeSide", () =>
    import("components/attendee/errors/Unauthorized").then(
      ({ Unauthorized }) => ({
        default: Unauthorized,
      })
    )
  )
);

export const Unauthorized: React.FC = () => {
  const isAdminContext = useAdminContextCheck();
  return isAdminContext ? <AdminSide /> : <AttendeeSide />;
};
