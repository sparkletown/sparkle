# makegraphs.py - Graph Party Attendance, Stay Duration, and Movements

The `makegraphs.py` script will create `analytics.pdf` based on Usage Reports from your event, containing:

- A stacked chart of attendance for all rooms
- Attendance charts for each room
- Stay durations for each party segment (currently "whole party", "first half", "second half", and "afterparty")
- Movements between rooms during the party

To use the script for your party:

1. Obtain the **Usage Reports** for all meetings during your party:
  - As a **non admin user** (zoom doesn't let admin users access these reports for #reasons)
  - Go to Reports
  - Go to Usage
  - Select the date range of your event
  - Download all the CSVs for your meeting
  - (NOTE: there may be more than one. This is because if the room empties out, the meeting ends. It starts again when someone else comes back in, causing multiple reports to be generated.)
2. Modify the party start date at the top of the code
3. Run the script, passing in the paths to all the CSVs as command-line arguments
4. Open the "analytics.pdf" file to view the results.