import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

import { PLAYA_TIMEZONE } from "settings";

// @debt deprecated dayjs library, use date-fns instead
dayjs.extend(utc);
dayjs.extend(timezone);

export const usePlayaTime = () => dayjs().tz(PLAYA_TIMEZONE);
