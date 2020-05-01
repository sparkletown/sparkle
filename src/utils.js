import { format } from 'date-fns';

export function formatUtcSeconds(utcSec) {
	return format(new Date(utcSec * 1000), "MMM d p")
}
