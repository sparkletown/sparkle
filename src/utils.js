import { format } from 'date-fns';

export function formatUtcSeconds(utcSec) {
	return format(new Date(utcSec * 1000), "MMM d p")
}

export function isConfigValid(config) {
	return config !== undefined &&
		config['name'] !== undefined &&
		config['value'] !== undefined;
}

export function isRoomValid(room) {
	return room !== undefined &&
		room.id !== undefined &&
		room.open !== undefined &&
		(room.open === true || room.open === false) &&
		room.url !== undefined &&
		room.title !== undefined &&
		room.subtitle !== undefined;
}
