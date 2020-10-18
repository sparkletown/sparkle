export const RETAIN_ATTENDANCE: string = "RETAIN_ATTENDANCE";

interface RetainAttenanceAction {
  type: typeof RETAIN_ATTENDANCE;
  payload: boolean;
}

export const retainAttendance = (retainAttendance: boolean) => ({
  type: RETAIN_ATTENDANCE,
  payload: retainAttendance,
});

export type AttendanceActions = RetainAttenanceAction;
