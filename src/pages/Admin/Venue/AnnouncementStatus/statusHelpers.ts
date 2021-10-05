import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";

const ENABLED__TEXT = "enabled";
const DISABLED__TEXT = "disabled";

export const getStatusIcon = (status?: boolean) => (status ? faCheck : faTimes);
export const getStatusText = (status?: boolean) =>
  status ? ENABLED__TEXT : DISABLED__TEXT;
