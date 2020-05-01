export function isAnnouncementValid(announcement) {
	return announcement !== undefined &&
		announcement.id !== undefined &&
		announcement.announcer !== undefined &&
		announcement.ts_utc !== undefined &&
		typeof announcement.ts_utc !== 'number' &&
		announcement.text !== undefined;
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
