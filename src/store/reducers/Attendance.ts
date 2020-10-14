import { AttendanceActions, REMAIN_ATTENDANCE } from "../actions/Attendance";

interface AttendanceState {
  remainAttendance: boolean;
}

const initialAttendanceState: AttendanceState = {
  remainAttendance: false,
};

export const attendanceReducer = (
  state = initialAttendanceState,
  action: AttendanceActions
): AttendanceState => {
  switch (action.type) {
    case REMAIN_ATTENDANCE:
      return { ...state, remainAttendance: action.payload };
    default:
      return state;
  }
};
