function validDate(date) {
	return typeof date === 'object' &&
		date.seconds > 0;

}

function validBool(bool) {
	return bool !== undefined &&
		(bool === true || bool === false);
}

export function isAnnouncementValid(announcement) {
	return announcement !== undefined &&
		announcement.id !== undefined &&
		announcement.announcer !== undefined &&
		announcement.ts_utc !== undefined &&
		validDate(announcement.ts_utc) &&
		announcement.text !== undefined;
}

export function isRoomValid(room) {
	return room !== undefined &&
		room.id !== undefined &&
		validBool(room.open) &&
		validBool(room.on_map) &&
		validBool(room.on_list) &&
		typeof room.order === 'number' &&
		room.path !== undefined &&
		room.url !== undefined &&
		room.title !== undefined &&
		room.subtitle !== undefined;
}
