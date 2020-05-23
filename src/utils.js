import { format } from 'date-fns';
import { PARTY_START_UTC_SECONDS } from './config';

export function roomSlug(room) {
  return room.name
    .split(' ').join('-')
    .split('(').join('-')
    .split(')').join('-')
    .split('"').join('-')
    .split('&').join('-');
}

export function formatHour(hour) {
  if (hour === null || hour === undefined) {
    return '(unknown)';
  }
  const utcSeconds = PARTY_START_UTC_SECONDS + (hour * 60 * 60);
  return formatUtcSeconds(utcSeconds);
}

export function formatUtcSeconds(utcSec) {
	return format(new Date(utcSec * 1000), "p")
}
