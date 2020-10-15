import { AttendanceActions, RETAIN_ATTENDANCE } from "../actions/Attendance";

interface AttendanceState {
  retainAttendance: boolean;
}

const initialAttendanceState: AttendanceState = {
  retainAttendance: false,
};

export const attendanceReducer = (
  state = initialAttendanceState,
  action: AttendanceActions
): AttendanceState => {
  switch (action.type) {
    case RETAIN_ATTENDANCE:
      return { ...state, retainAttendance: action.payload };
    default:
      return state;
  }
};
