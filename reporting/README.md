# fetch-reports.js and makegraphs.py - Graph Party Attendance, Stay Duration, and Movements

The `makegraphs.py` script will create `analytics.pdf` based on Usage Reports from your event, containing:

- A stacked chart of attendance for all rooms
- Attendance charts for each room
- Stay durations for each party segment (currently "whole party", "first half", "second half", and "afterparty")
- Movements between rooms during the party

There are 2 major steps involved:

1. `fetch-reports.js` opens a headless puppeteer window, goes to Zoom's report download page, and fetches all the reports as CSVs into ~/Downloads. (I tried APIs, other report types, nothing else gives this data as far as I can tell.)
2. `makegraphs.py` uses a variety of python libraries to create visualizations of the data downloaded in the CSV. It currently saves the results to `analytics.pdf`, overwriting any previous file in that path.

Below are the steps you need to take to make use of these scripts.

# How to generate an analytics report

1. Open `fetch-reports.js` and update the date range to 1 day before and 1 day after your target party.
2. Set `newLogin = false` for your first run of the script; it will save cookies for you that will let you bypass login and captcha next time.
3. Run the script:

```
$ node fetch-reports.js
```

4. Puppeteer will pop up a Chrome browser with a login prompt; log in with the admin credentials for zoom. You may be able to find these in a password store; at Sparkle, we keep them in 1Password.
5. Fill in the CAPTCHA, if required.
6. After the browser arrives at the page with the reports, visually inspect that the reports you wanted are there.
7. Ensure you are flip back to the first page of results, then press any key in the script, so it proceeds.
8. The script can be finicky; you may have to restart it. Before restarting, remove any `participants_*.csv` files so you don't end up with duplicates in the final end report.
9. Move all the CSV files it has downloaded to a new directory, eg. `My Event CSVs`.
10. Remove any CSVs that do not relate to your event, such as internal meetings, meetings for other events etc.
11. Open `makegraphs.py` and modify the dates to the time range of your event.
12. Optionally, modify the time ranges (eg. "Whole party") to suit your needs. You may wish to provide stay duration histograms for the first half, second half, etc.
13. Run:

```
$ pip3 install virtualenv
$ virtualenv env
$ . env/bin/activate
$ pip3 install hv numpy matplotlib # there may be others, please update the docs!
$ python3 makegraphs.py ~/Downloads/My\ Event\ CSVs/*.csv # python 3 compatible, unsure about python2
```

14. Open the report:

```
$ open analytics.pdf
```

15. Rename and move the report away as needed.
