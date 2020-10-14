export const REMAIN_ATTENDANCE: string = "REMAIN_ATTENDANCE";

interface RemainAttenanceAction {
  type: typeof REMAIN_ATTENDANCE;
  payload: boolean;
}

export const remainAttendance = (remainAttendance: boolean) => ({
  type: REMAIN_ATTENDANCE,
  payload: remainAttendance,
});

export type AttendanceActions = RemainAttenanceAction;
