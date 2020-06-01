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

# Holoviews init
hv.extension('matplotlib')

# REVISIT: move to args
# Uncomment for info logging
# logging.basicConfig(level=logging.INFO)
# Uncomment for debug logging
logging.basicConfig(level=logging.DEBUG)
log = logging.getLogger(__name__)


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
		return '{} -> {}'.format(self.start, self.end)


class Config():
	# REVISIT: move to command-line args
	# Party start/duration/end
	START = datetime(2020,5,16,12,0,0,0)
	END = START + timedelta(hours=12)
	SEGMENTS = {
		'Whole party': TimeRange(START, START + timedelta(hours=8)),
		'First Half of Party': TimeRange(START, START + timedelta(hours=4)),
		'Second Half of Party': TimeRange(START + timedelta(hours=4), START + timedelta(hours=8)),
		'Afterparty Hour 8-12': TimeRange(START + timedelta(hours=8), START + timedelta(hours=12))
	}


class ZoomReportParser():	
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

	room_timezone_offsets = {
		'Moon Rock Room- Live performers and deep space hitchhikers': timedelta(hours=-1),
		'Midnight Reception': timedelta(hours=-1)
	}

	@classmethod
	def real_room_name(cls, room, meeting_id):
		if meeting_id in cls.meeting_id_renames:
			return cls.meeting_id_renames[meeting_id]
		if room in cls.room_renames:
			return cls.room_renames[room]
		return room

	def __init__(self, filenames):
		self._all_visits = []
		self._visits_by_user = {}
		self._all_joins = []
		self._all_leaves = []
		self._rooms = []
		self._room_joins = {}
		self._room_leaves = {}
		self._all_visit_durations = []
		self._visit_durations = {}
		self.parse(filenames)

	def parse(self, filenames):
		for f in filenames:
			with open(f) as csvfile:
				filename = os.path.basename(csvfile.name)
				log.info("Opening file {}".format(filename))
				if filename.startswith('UserQos_'):
					self.process_admin_report(csvfile)
				elif filename.startswith('participants_'):
					self.process_user_report(csvfile)
				else:
					raise Error('unknown csv format based on filename: {} for {}'.format(filename, f))

		self.sort_data()
		log.info("Parsing completed. Total visits: {}, Total users: {}".format(len(self._all_visits), len(self._visits_by_user.keys())))
		self.log_debug_stats()

	def sort_data(self):
		self._all_joins.sort()
		self._all_leaves.sort()
		for room in self._rooms:
			self._room_joins[room].sort()
			self._room_leaves[room].sort()
		for user in self._visits_by_user:
			self._visits_by_user[user].sort(key=lambda user_visit: user_visit['visit'].start)

	def record_visit(self, user, room, meeting_id, join_time, leave_time):
		room = self.real_room_name(room, meeting_id)
		log.debug("record_visit: Room {}; User: {}; Entered: {}; Left: {}".format(room, user, join_time, leave_time))

		if room in self.room_timezone_offsets:
			log.debug("Room {} has an offset of {}; correcting join and leave times".format(room, room_offsets[room]))
			join_time = join_time + room_timezone_offsets[room]
			leave_time = leave_time + room_timezone_offsets[room]

		if leave_time < join_time:
			log.debug("Error: leave time is before join time")
			exit(1)

		if leave_time < Config.START:
			log.debug("### Discarding visit, it ends before the party started")
			return

		if join_time > Config.END:
			log.debug("### Discarding visit, it starts after the party ended")
			return

		if join_time < Config.START:
			log.debug("@@@ Bumping visit start time {} to party start {}".format(join_time, Config.START))
			join_time = Config.START

		if leave_time > Config.END:
			log.debug("@@@ Bumping visit end time {} to party end {}".format(leave_time, Config.END))
			leave_time = Config.END

		visit = TimeRange(join_time, leave_time)
		self._all_visits.append({'room': room, 'user': user, 'visit': visit})
		
		if user not in self._visits_by_user:
			self._visits_by_user[user] = []
		self._visits_by_user[user].append({'room': room, 'visit': visit})
		
		self._all_joins.append(join_time)
		self._all_leaves.append(leave_time)

		if room not in self._rooms:
			self._rooms.append(room)

		if room not in self._room_joins:
			self._room_joins[room] = []
		self._room_joins[room].append(join_time)

		if room not in self._room_leaves:
			self._room_leaves[room] = []
		self._room_leaves[room].append(leave_time)

		self._all_visit_durations.append(visit.total_minutes())
		for segment in Config.SEGMENTS:
			for room in self._rooms:
				if visit.is_overlapped(Config.SEGMENTS[segment]):
					if segment not in self._visit_durations:
						self._visit_durations[segment] = {}
					if room not in self._visit_durations[segment]:
						self._visit_durations[segment][room] = []
					self._visit_durations[segment][room].append(visit.total_minutes())

	def process_admin_report(self, csvfile):
		log.debug("process_admin_report: Processing {}...".format(csvfile.name))
		# Ignore header row
		csvfile.readline()
		header_values = csvfile.readline().split(',')
		room = header_values[0]
		log.debug("Got room name: {}".format(room))
		meeting_id = header_values[1]
		log.debug("Got meeting ID: {}".format(meeting_id))
		meeting_start_time_str = header_values[8] + header_values[9]
		meeting_start_date = datetime.strptime(meeting_start_time_str, '"%b %d %Y %I:%M %p"').date()
		meeting_start_datetime = datetime(year=meeting_start_date.year, month=meeting_start_date.month, day=meeting_start_date.day)
		log.debug("Got meeting start day: {} (raw: {})".format(meeting_start_datetime, meeting_start_time_str))

		# Slurp a character from the CSV, to make DictReader behave.
		# Perhaps an intern built Zoom's CSV export,
		csvfile.read(1)

		r = csv.DictReader(csvfile)
		for row in r:
			participant = row['Participant']
			location = row['Location'].replace(' )', ')')
			user = "{} from {}".format(participant, location)
			join_time_str = row.get('Join Time')
			leave_time_str = row.get('Leave Time').split('(')[0]

			join_time_parsed = datetime.strptime(join_time_str, '%I:%M %p')
			join_time = meeting_start_datetime + timedelta(hours=join_time_parsed.hour, minutes=join_time_parsed.minute, seconds=join_time_parsed.second)
			
			leave_time_parsed = datetime.strptime(leave_time_str, '%I:%M %p')
			leave_time = meeting_start_datetime + timedelta(hours=leave_time_parsed.hour, minutes=leave_time_parsed.minute, seconds=leave_time_parsed.second)

			self.record_visit(user, room, meeting_id, join_time, leave_time)


	def process_user_report(self, csvfile):
		log.debug("process_user_report: Processing {}...".format(csvfile.name))
		# Ignore header row
		csvfile.readline()
		header_values = csvfile.readline().split(',')
		meeting_id = header_values[0]
		log.debug("Got meeting ID: {}".format(meeting_id))
		room = header_values[1]
		log.debug("Got room topic: {}".format(room))

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

			self.record_visit(user, room, meeting_id, join_time, leave_time)


	def log_debug_stats(self):
		overlapping_visits = []
		for user in self._visits_by_user.keys():
			for visit1 in self._visits_by_user[user]:
				for visit2 in self._visits_by_user[user]:
					if visit1 != visit2 and visit1['visit'].is_overlapped(visit2['visit']):
						overlapping_visits.append({'user': user, 'visit': visit1})
		log.debug("Total overlapping visits: {}".format(len(overlapping_visits)))

		log.debug("Total joins: {}".format(len(self._all_joins)))
		log.debug("Total leaves: {}".format(len(self._all_leaves)))
		log.debug("Rooms joined: {}".format(self._room_joins.keys()))
		log.debug("Rooms left: {}".format(self._room_joins.keys()))
		for room in self._rooms:
			log.debug("Room {0}: {1} joins, {2} leaves".format(room, len(self._room_joins[room]), len(self._room_leaves[room])))
		log.debug("Average duration per room per segment:")
		for segment in Config.SEGMENTS:
			log.debug("Segment: {0}".format(segment))
			if segment in self._visit_durations:
				for room in self._rooms:
					if room in self._visit_durations[segment]:
						log.debug("Room: {0}, Average: {1}".format(room, sum(self._visit_durations[segment][room])/len(self._visit_durations[segment][room])))

		first_visit_rooms = {}
		last_visit_rooms = {}
		for user in self._visits_by_user:
			first_room = self._visits_by_user[user][0]['room']
			if first_room not in first_visit_rooms:
				first_visit_rooms[first_room] = []
			first_visit_rooms[first_room].append(user)

			last_room = self._visits_by_user[user][len(self._visits_by_user[user])-1]['room']
			if last_room not in last_visit_rooms:
				last_visit_rooms[last_room] = []
			last_visit_rooms[last_room].append(user)

		for room in first_visit_rooms:
			log.debug("Users whose first visit was to {0} ({1}): {2}".format(room, len(first_visit_rooms[room]), ','.join(first_visit_rooms[room])))
		for room in last_visit_rooms:
			log.debug("Users whose last visit was to {0} ({1}): {2}".format(room, len(last_visit_rooms[room]), ','.join(last_visit_rooms[room])))

	def rooms(self):
		return self._rooms

	def visit_durations(self):
		return self._all_visit_durations, self._visit_durations

	def moves(self):
		ENTERED = '(entered)'
		EXITED = '(exited)'
		moves = {}
		moves[ENTERED] = {}

		for user in self._visits_by_user:
			for i in range(len(self._visits_by_user[user])+1):
				if i == 0:
					from_room = ENTERED
				else:
					prev_visit = self._visits_by_user[user][i-1]
					from_room = prev_visit['room']

				if i < len(self._visits_by_user[user]):
					to_room = self._visits_by_user[user][i]['room']

					# Eliminate "moves to the same room" from the data
					while from_room == to_room:
						i += 1
						if i < len(self._visits_by_user[user]):
							to_room = self._visits_by_user[user][i]['room']
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

	def attendances(self):
		# Generate x for every second in the data
		x = [Config.START + timedelta(seconds=x) for x in range(0, (Config.END - Config.START).seconds)]
		
		y_rooms = []
		for room in self._rooms:
			y = []
			tally = 0
			join_index = 0
			leave_index = 0
			total_joins = 0
			total_leaves = 0
			log.debug("Room {0}: first join: {1}, last join: {2}, first leave: {3}, last leave: {4}".format(room, self._room_joins[room][0], self._room_joins[room][len(self._room_joins[room])-1], self._room_leaves[room][0], self._room_leaves[room][len(self._room_leaves[room])-1]))
			for i in x:
				if join_index < len(self._room_joins[room]) and i >= self._room_joins[room][join_index]:
					tally += 1
					join_index += 1
					total_joins += 1
				if leave_index < len(self._room_leaves[room]) and i >= self._room_leaves[room][leave_index]:
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
		log.debug("All joins/leaves: first join: {0}, last join: {1}, first leave: {2}, last leave: {3}".format(self._all_joins[0], self._all_joins[len(self._all_joins)-1], self._all_leaves[0], self._all_leaves[len(self._all_leaves)-1]))
		for i in x:
			if join_index < len(self._all_joins) and i >= self._all_joins[join_index]:
				tally += 1
				join_index += 1
				total_joins += 1
			if leave_index < len(self._all_leaves) and i >= self._all_leaves[leave_index]:
				tally -= 1
				leave_index += 1
				total_leaves += 1
			y_all.append(tally)
		log.debug("Recorded {0} joins and {1} leaves for all rooms".format(total_joins, total_leaves))

		return x, y_rooms, y_all


class PdfGenerator():
	def __init__(self, filename):
		self.filename = filename

	def start(self):
		log.info("Creating {}...".format(self.filename))
		self.pdf = matplotlib.backends.backend_pdf.PdfPages(self.filename)
		return self

	def attendances(self, x, y_rooms, y_all, rooms):
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
		self.pdf.savefig(fig)

		fig, ax = plt.subplots()
		ax.plot(x, y_all)
		ax.xaxis.set_major_locator(hours)
		ax.xaxis.set_major_formatter(hours_fmt)
		ax.xaxis.set_minor_locator(ten_minutes)
		ax.set_xlabel('Time (PT)')
		ax.set_ylabel('Attendance (All)')
		ax.grid(True)
		fig.autofmt_xdate()
		self.pdf.savefig(fig)

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
			self.pdf.savefig(fig)
		return self

	def visit_durations(self, all_visit_durations, visit_durations, rooms):
		log.info("Generating visit durations...")
		longest_visit = int(max(all_visit_durations))

		for segment in Config.SEGMENTS:
			fig, ax = plt.subplots()
			for room in rooms:
				if segment in visit_durations and room in visit_durations[segment]:
					ax.hist(visit_durations[segment][room], label=room, histtype='step', bins=longest_visit)
			ax.legend(loc='upper right', prop={'size': 4})
			ax.set_xlabel("Duration (minutes)")
			plt.xlim(left=0, right=120)
			ax.set_ylabel("Quantity")
			plt.title("Visit Durations ({0})".format(segment))
			self.pdf.savefig(fig)

		for room in rooms:
			fig, ax = plt.subplots()
			for segment in Config.SEGMENTS:
				if segment in visit_durations and room in visit_durations[segment]:
					ax.hist(visit_durations[segment][room], label=segment, histtype='step', bins=longest_visit)
			ax.legend(loc='upper right', prop={'size': 4})
			ax.set_xlabel("Duration (minutes)")
			plt.xlim(left=0, right=120)
			ax.set_ylabel("Quantity")
			plt.title("Visit Durations ({0})".format(room))
			self.pdf.savefig(fig)
		return self

	def moves(self, moves_list):
		log.info("Generating moves...")
		df = pd.DataFrame(moves_list, columns=['from', 'to', 'value'])
		fig = hv.render(hv.Sankey(moves_list, ['from', 'to'], vdims='value').opts(cmap='Dark2', edge_color='to', node_color='index'))
		self.pdf.savefig(fig)
		return self

	def finish(self):
		log.info("Saving...")
		self.pdf.close()


def main():
	parser = ZoomReportParser(sys.argv[1:])
	rooms = parser.rooms()
	x, y_rooms, y_all = parser.attendances()
	all_visit_durations, visit_durations = parser.visit_durations()
	moves = parser.moves()

	generator = PdfGenerator('analytics.pdf')
	generator \
		.start() \
		.attendances(x, y_rooms, y_all, rooms) \
		.visit_durations(all_visit_durations, visit_durations, rooms) \
		.moves(moves) \
		.finish()

if __name__ == "__main__":
	main()