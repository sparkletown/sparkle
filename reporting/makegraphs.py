#!/usr/bin/env python3

import csv
from datetime import datetime, timedelta
import holoviews as hv
from holoviews import dim, opts
import logging
import matplotlib.backends.backend_pdf
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
import numpy as np
import pandas as pd
import os
import sys
import time

hv.extension('matplotlib')

# logging.basicConfig(level=logging.INFO)
# Uncomment for debug logging
logging.basicConfig(level=logging.DEBUG)

log = logging.getLogger(__name__)

PARTY_START = datetime(2020,5,2,12,0,0,0)
PARTY_END = PARTY_START + timedelta(hours=16)

meeting_id_renames = {
	'81259280306': 'Shrinking Station',
	'82383634053': 'Tip of the Tongue',
	'89072177227': 'Heart of the Party',
	'85105150305': 'All Ears',
	'84119671594': 'Court-X',
	'85485729711': 'Third Eye',
	'85030810493': 'The Voice Box',
	'83776728154': 'InDigest-Inn',
	'88193100121': 'Womb For Improvement',
	'87127042202': 'Funk in the Trunk',
	'86578482268': 'The Clitoris',
	'86901109362': 'Try Your Hand',
	'81896872245': 'The Bladder',
	'89718158675': 'Funny Bones'
}

room_renames = {
	'Welcome to the Tree of Life 1': 'Rabbit Hole - Entrance Experience',
	'Welcome to the Tree of Life 2': 'The Roots',
	'Welcome to the Tree of Life 3': 'Upside Down Room - The Bat Cave',
	'Welcome to the Tree of Life 4': 'Funk in the Trunk',
	'Welcome to the Tree of Life 5': 'Heart Room',
	'Welcome to the Tree of Life 6': 'The Mood Swing',
	'Welcome to the Tree of Life 7': 'The Treehouse',
	'Welcome to the Tree of Life 8': 'The Beehive',
	'Welcome to the Tree of Life 9': 'The Canopy',
	'Welcome to the Tree of Life 10': 'The Compost Heap (Toilets Here)',
	'Welcome to the Tree of Life 11': 'Sunset Room',
	'Welcome to the Tree of Life 12': 'Lost Soul Chamber'
}

def room_name(room, meeting_id):
	if meeting_id in meeting_id_renames:
		return meeting_id_renames[meeting_id]
	if room in room_renames:
		return room_renames[room]
	return room

class TimeRange(object):
	def __init__(self, start, end):
		self.start = start
		self.end = end
		self.duration = self.end - self.start

	def is_overlapped(self, time_range):
		return max(self.start, time_range.start) < min(self.end, time_range.end)

	def total_minutes(self):
		return (self.end - self.start).total_seconds() / 60

	def __repr__(self):
		return '{0} -> {1}'.format(self.start, self.end)


party_segments = {
	'Whole party': TimeRange(PARTY_START, PARTY_START + timedelta(hours=8)),
	'First Half of Party': TimeRange(PARTY_START, PARTY_START + timedelta(hours=4)),
	'Second Half of Party': TimeRange(PARTY_START + timedelta(hours=4), PARTY_START + timedelta(hours=8)),
	'Afterparty Hour 8-12': TimeRange(PARTY_START + timedelta(hours=8), PARTY_START + timedelta(hours=12))
}

def usage():
	print(
"""{0}: make graphs of zoom meetings from UserQos... CSVs.

Must add a new first column to the header row of each CSV: Room Name.
Export CSV of each meeting from the dashboard and add the new	at the left of the header.

Usage: {0} csv1.csv [csv2.csv csv3.csv...]
""".format(sys.argv[0]))

if len(sys.argv) <= 1:
	usage()
	sys.exit()

all_visits = []
visits_by_user = {}
all_joins = []
all_leaves = []
rooms = []
room_joins = {}
room_leaves = {}
all_visit_durations = []
visit_durations = {}

room_offsets = {
	'Moon Rock Room- Live performers and deep space hitchhikers': timedelta(hours=-1),
	'Midnight Reception': timedelta(hours=-1)
}


def record_visit(user, room, meeting_id, join_time, leave_time):
	actual_room = room_name(room, meeting_id)
	log.debug("record_visit: Room {0}; User: {1}; Entered: {2}; Left: {3}".format(actual_room, user, join_time, leave_time))

	if actual_room in room_offsets:
		log.debug("Room {0} has an offset of {1}; correcting join and leave times".format(actual_room, room_offsets[actual_room]))
		join_time = join_time + room_offsets[actual_room]
		leave_time = leave_time + room_offsets[actual_room]

	if leave_time < join_time:
		log.debug("Error: leave time is before join time")
		exit(1)

	if leave_time < PARTY_START:
		log.debug("### Discarding visit, it ends before the party started")
		return

	if join_time > PARTY_END:
		log.debug("### Discarding visit, it starts after the party ended")
		return

	if join_time < PARTY_START:
		log.debug("@@@ Bumping visit start time {0} to party start {1}".format(join_time, PARTY_START))
		join_time = PARTY_START

	if leave_time > PARTY_END:
		log.debug("@@@ Bumping visit end time {0} to party end {1}".format(leave_time, PARTY_END))
		leave_time = PARTY_END

	visit = TimeRange(join_time, leave_time)
	all_visits.append({'room': actual_room, 'user': user, 'visit': visit})
	
	if user not in visits_by_user:
		visits_by_user[user] = []
	visits_by_user[user].append({'room': actual_room, 'visit': visit})
	
	all_joins.append(join_time)
	all_leaves.append(leave_time)

	if actual_room not in rooms:
		rooms.append(actual_room)

	if actual_room not in room_joins:
		room_joins[actual_room] = []
	room_joins[actual_room].append(join_time)

	if actual_room not in room_leaves:
		room_leaves[actual_room] = []
	room_leaves[actual_room].append(leave_time)

	all_visit_durations.append(visit.total_minutes())
	for segment in party_segments:
		for actual_room in rooms:
			if visit.is_overlapped(party_segments[segment]):
				if segment not in visit_durations:
					visit_durations[segment] = {}
				if actual_room not in visit_durations[segment]:
					visit_durations[segment][actual_room] = []
				visit_durations[segment][actual_room].append(visit.total_minutes())


def process_admin_report(f):
	log.debug("process_admin_report: Processing {0}...".format(f))
	# Ignore header row
	csvfile.readline()
	header_values = csvfile.readline().split(',')
	room = header_values[0]
	log.debug("Got room name: {0}".format(room))
	meeting_id = header_values[1]
	log.debug("Got meeting ID: {0}".format(meeting_id))
	meeting_start_time_str = header_values[8] + header_values[9]
	meeting_start_date = datetime.strptime(meeting_start_time_str, '"%b %d %Y %I:%M %p"').date()
	meeting_start_datetime = datetime(year=meeting_start_date.year, month=meeting_start_date.month, day=meeting_start_date.day)
	log.debug("Got meeting start day: {0} (raw: {1})".format(meeting_start_datetime, meeting_start_time_str))

	# Slurp a character from the CSV, to make DictReader behave.
	# Perhaps an intern built Zoom's CSV export,
	csvfile.read(1)

	r = csv.DictReader(csvfile)
	for row in r:
		participant = row['Participant']
		location = row['Location'].replace(' )', ')')
		user = "{0} from {1}".format(participant, location)
		join_time_str = row.get('Join Time')
		leave_time_str = row.get('Leave Time').split('(')[0]

		join_time_parsed = datetime.strptime(join_time_str, '%I:%M %p')
		join_time = meeting_start_datetime + timedelta(hours=join_time_parsed.hour, minutes=join_time_parsed.minute, seconds=join_time_parsed.second)
		
		leave_time_parsed = datetime.strptime(leave_time_str, '%I:%M %p')
		leave_time = meeting_start_datetime + timedelta(hours=leave_time_parsed.hour, minutes=leave_time_parsed.minute, seconds=leave_time_parsed.second)

		record_visit(user, room, meeting_id, join_time, leave_time)


def process_user_report(csfile):
	log.debug("process_user_report: Processing {0}...".format(f))
	# Ignore header row
	csvfile.readline()
	header_values = csvfile.readline().split(',')
	meeting_id = header_values[0]
	log.debug("Got meeting ID: {0}".format(meeting_id))
	room = header_values[1]
	log.debug("Got room topic: {0}".format(room))

	# Slurp a character from the CSV, to make DictReader behave.
	# Perhaps an intern built Zoom's CSV export,
	csvfile.read(1)

	r = csv.DictReader(csvfile)
	for row in r:
		user = row['Name (Original Name)']
		email = row['User Email']
		if len(email) > 0:
			user = email

		join_time_str = row.get('Join Time')
		leave_time_str = row.get('Leave Time')

		join_time = datetime.strptime(join_time_str, '%m/%d/%Y %I:%M:%S %p')
		leave_time = datetime.strptime(leave_time_str, '%m/%d/%Y %I:%M:%S %p')

		record_visit(user, room, meeting_id, join_time, leave_time)


def generate_moves(visits_by_user):
	ENTERED = '(entered)'
	EXITED = '(exited)'
	moves = {}
	moves[ENTERED] = {}

	for user in visits_by_user:
		sorted_visits = sorted(visits_by_user[user], key=lambda user_visit: user_visit['visit'].start)

		for i in range(len(sorted_visits)+1):
			if i == 0:
				from_room = ENTERED
			else:
				prev_visit = sorted_visits[i-1]
				from_room = prev_visit['room']

			if i < len(sorted_visits):
				to_room = sorted_visits[i]['room']

				# Eliminate "moves to the same room" from the data
				while from_room == to_room:
					i += 1
					if i < len(sorted_visits):
						to_room = sorted_visits[i]['room']
					else:
						to_room = EXITED
			else:
				to_room = EXITED

			if from_room not in moves:
				moves[from_room] = {}
			if to_room not in moves[from_room]:
				moves[from_room][to_room] = 0

			moves[from_room][to_room] = moves[from_room][to_room] + 1

	moves_list = []
	for from_room in moves.keys():
		for to_room in moves[from_room].keys():
			moves_list.append((from_room + ' ', to_room, moves[from_room][to_room]))

	return moves_list

def generate_attendances(rooms, all_joins, all_leaves, joins, leaves):
	all_joins.sort()
	all_leaves.sort()
	for room in rooms:
		joins[room].sort()
		leaves[room].sort()

	# Generate x for every second in the data
	min_x = min([
		min(
			all_joins[0],
			joins[room][0],
			all_leaves[0],
			leaves[room][0])
		for room in rooms])
	max_x = max([
		max(
			all_joins[len(all_joins)-1],
			joins[room][len(joins[room])-1],
			all_leaves[len(all_leaves)-1],
			leaves[room][len(leaves[room])-1])
		for room in rooms])
	x = [min_x + timedelta(seconds=x) for x in range(0, (max_x-min_x).seconds)]
	
	y_rooms = []
	for room in rooms:
		y = []
		tally = 0
		join_index = 0
		leave_index = 0
		total_joins = 0
		total_leaves = 0
		log.debug("Room {0}: first join: {1}, last join: {2}, first leave: {3}, last leave: {4}".format(room, joins[room][0], joins[room][len(joins[room])-1], leaves[room][0], leaves[room][len(leaves[room])-1]))
		for i in x:
			if join_index < len(joins[room]) and i >= joins[room][join_index]:
				tally += 1
				join_index += 1
				total_joins += 1
			if leave_index < len(leaves[room]) and i >= leaves[room][leave_index]:
				tally -= 1
				leave_index += 1
				total_leaves += 1
			y.append(tally)
		log.debug("Recorded {0} joins and {1} leaves for room {2}".format(total_joins, total_leaves, room))
		y_rooms.append(y)
	
	y_all = []
	tally = 0
	join_index = 0
	leave_index = 0
	total_joins = 0
	total_leaves = 0
	log.debug("All joins/leaves: first join: {0}, last join: {1}, first leave: {2}, last leave: {3}".format(all_joins[0], all_joins[len(all_joins)-1], all_leaves[0], all_leaves[len(all_leaves)-1]))
	for i in x:
		if join_index < len(all_joins) and i >= all_joins[join_index]:
			tally += 1
			join_index += 1
			total_joins += 1
		if leave_index < len(all_leaves) and i >= all_leaves[leave_index]:
			tally -= 1
			leave_index += 1
			total_leaves += 1
		y_all.append(tally)
	log.debug("Recorded {0} joins and {1} leaves for all rooms".format(total_joins, total_leaves))

	return x, y_rooms, y_all


for f in sys.argv[1:]:
	with open(f) as csvfile:
		filename = os.path.basename(csvfile.name)
		log.info("Opening file {0}".format(filename))
		if filename.startswith('UserQos_'):
			process_admin_report(f)
		elif filename.startswith('participants_'):
			process_user_report(f)
		else:
			raise Error('unknown csv format based on filename: {}'.format(f))

log.info("Total visits: {0}".format(len(all_visits)))
log.info("Total users: {0}".format(len(visits_by_user.keys())))

overlapping_visits = []
for user in visits_by_user.keys():
	for visit1 in visits_by_user[user]:
		for visit2 in visits_by_user[user]:
			if visit1 != visit2 and visit1['visit'].is_overlapped(visit2['visit']):
				overlapping_visits.append({'user': user, 'visit': visit1})
log.debug("Total overlapping visits: {0}".format(len(overlapping_visits)))

log.debug("Total joins: {0}".format(len(all_joins)))
log.debug("Total leaves: {0}".format(len(all_leaves)))
log.debug("Rooms joined: {0}".format(room_joins.keys()))
log.debug("Rooms left: {0}".format(room_joins.keys()))
for room in rooms:
	log.debug("Room {0}: {1} joins, {2} leaves".format(room, len(room_joins[room]), len(room_leaves[room])))
log.debug("Average duration per room per segment:")
for segment in party_segments:
	log.debug("Segment: {0}".format(segment))
	if segment in visit_durations:
		for room in rooms:
			if room in visit_durations[segment]:
				log.debug("Room: {0}, Average: {1}".format(room, sum(visit_durations[segment][room])/len(visit_durations[segment][room])))

first_visit_rooms = {}
last_visit_rooms = {}
for user in visits_by_user:
	sorted_visits = sorted(visits_by_user[user], key=lambda user_visit: user_visit['visit'].start)
	first_room = sorted_visits[0]['room']
	if first_room not in first_visit_rooms:
		first_visit_rooms[first_room] = []
	first_visit_rooms[first_room].append(user)

	last_room = sorted_visits[len(visits_by_user[user])-1]['room']
	if last_room not in last_visit_rooms:
		last_visit_rooms[last_room] = []
	last_visit_rooms[last_room].append(user)

for room in first_visit_rooms:
	log.debug("Users whose first visit was to {0} ({1}): {2}".format(room, len(first_visit_rooms[room]), ','.join(first_visit_rooms[room])))
for room in last_visit_rooms:
	log.debug("Users whose last visit was to {0} ({1}): {2}".format(room, len(last_visit_rooms[room]), ','.join(last_visit_rooms[room])))

x, y_rooms, y_all = generate_attendances(rooms, all_joins, all_leaves, room_joins, room_leaves)

log.info("Generating analytics PDF...")
pdf = matplotlib.backends.backend_pdf.PdfPages("analytics.pdf")

log.info("Generating attendances...")
hours = mdates.HourLocator()
ten_minutes = mdates.MinuteLocator(byminute=range(0, 60, 10))
hours_fmt = mdates.DateFormatter('%H:00')

fig, ax = plt.subplots()
ax.stackplot(x, y_rooms, labels=rooms)
ax.legend(loc='upper left', prop={'size': 4})
ax.xaxis.set_major_locator(hours)
ax.xaxis.set_major_formatter(hours_fmt)
ax.xaxis.set_minor_locator(ten_minutes)
ax.set_xlabel('Time (PT)')
ax.set_ylabel('Attendance (Stacked)')
ax.grid(True)
fig.autofmt_xdate()
pdf.savefig(fig)

fig, ax = plt.subplots()
ax.plot(x, y_all)
ax.xaxis.set_major_locator(hours)
ax.xaxis.set_major_formatter(hours_fmt)
ax.xaxis.set_minor_locator(ten_minutes)
ax.set_xlabel('Time (PT)')
ax.set_ylabel('Attendance (All)')
ax.grid(True)
fig.autofmt_xdate()
pdf.savefig(fig)

for i in range(len(rooms)):
	fig, ax = plt.subplots()
	ax.plot(x, y_rooms[i])
	ax.xaxis.set_major_locator(hours)
	ax.xaxis.set_major_formatter(hours_fmt)
	ax.xaxis.set_minor_locator(ten_minutes)
	ax.set_xlabel('Time (PT)')
	ax.set_ylabel("Attendance ({0})".format(rooms[i]))
	ax.grid(True)
	fig.autofmt_xdate()
	pdf.savefig(fig)

log.info("Generating attendance durations...")
longest_visit = int(max(all_visit_durations))

for segment in party_segments:
	fig, ax = plt.subplots()
	for room in rooms:
		if segment in visit_durations and room in visit_durations[segment]:
			ax.hist(visit_durations[segment][room], label=room, histtype='step', bins=longest_visit)
	ax.legend(loc='upper right', prop={'size': 4})
	ax.set_xlabel("Duration (minutes)")
	plt.xlim(left=0, right=120)
	ax.set_ylabel("Quantity")
	plt.title("Attendance Durations ({0})".format(segment))
	pdf.savefig(fig)

for room in rooms:
	fig, ax = plt.subplots()
	for segment in party_segments:
		if segment in visit_durations and room in visit_durations[segment]:
			ax.hist(visit_durations[segment][room], label=segment, histtype='step', bins=longest_visit)
	ax.legend(loc='upper right', prop={'size': 4})
	ax.set_xlabel("Duration (minutes)")
	plt.xlim(left=0, right=120)
	ax.set_ylabel("Quantity")
	plt.title("Attendance Durations ({0})".format(room))
	pdf.savefig(fig)

log.info("Generating party moves...")
moves_list = generate_moves(visits_by_user)

df = pd.DataFrame(moves_list, columns=['from', 'to', 'value'])
fig = hv.render(hv.Sankey(moves_list, ['from', 'to'], vdims='value').opts(cmap='Dark2', edge_color='to', node_color='index'))
pdf.savefig(fig)

pdf.close()