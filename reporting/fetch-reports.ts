#!/usr/bin/env node -r esm -r ts-node/register

// @debt replace this with the below line when we require node 14+
//   https://nodejs.org/docs/latest-v14.x/api/fs.html#fs_promise_example
// import { readFile, writeFile } from "fs/promises";
import { promises as fsPromises } from "fs";
import puppeteer from "puppeteer";

import { makeScriptUsage } from "../scripts/lib/helpers";

const { readFile, writeFile } = fsPromises;

// ---------------------------------------------------------
// Configuration (this is the bit you should edit)
// ---------------------------------------------------------

// Set to the dates one day before and one day after the day of reports to extract (MM/DD/YYYY)
const from = "10/05/2020";
const to = "10/08/2020";

// Zoom has a captcha, so save cookies to avoid logging in too many times.
// Set this to true to log in and save cookies.
// Set to false if cookies are already available.
const newLogin = true;

// The correct URL for accessing the reports is different for admin users who can
// access reports for all accounts under the zoom account. If you are trying to get
// reports from a standalone, non-admin user, set this to false.
const isAdmin = true;

// If the process crashes halfway through, set this to the page it was on to skip
// some pages - and hopefully avoid another crash.
const resumeFromPage = 1;

// Login credentials (only needed if newLogin is true)
const username: string = "";
const password: string = "";

// ---------------------------------------------------------
// HERE THERE BE DRAGONS (edit below here at your own risk)
// ---------------------------------------------------------

const reportPageUrl = isAdmin
  ? `https://zoom.us/account/report/user?from=${from}&to=${to}`
  : `https://zoom.us/account/my/report?from=${from}&to=${to}`;

const COOKIES_PATH = "./cookies.json";

const CONFIRM_VALUE = "i-have-edited-the-script-config-and-am-sure";

const usage = makeScriptUsage({
  description:
    "Fetch zoom usage reports from the admin console using a headless Chrome browser via puppeteer",
  usageParams: CONFIRM_VALUE,
  exampleParams: CONFIRM_VALUE,
});

const [confirmationCheck] = process.argv.slice(2);
if (confirmationCheck !== CONFIRM_VALUE) {
  usage();
}

const isNewLoginValid = newLogin && username !== "" && password !== "";

if (!isNewLoginValid) {
  console.error("Error: username/password are required when newLogin=true.");
  process.exit(1);
}

const keypress = async () => {
  process.stdin.setRawMode(true);
  return new Promise((resolve) =>
    process.stdin.once("data", () => {
      process.stdin.setRawMode(false);
      resolve();
    })
  );
};

// Log in to zoom, and download all participants reports from the above selected dates.
(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  const navigationPromise = page.waitForNavigation();

  await page.setViewport({ width: 1400, height: 900 });

  if (!newLogin) {
    console.log("Loading cookies");
    const cookiesString = await readFile(COOKIES_PATH).then((buffer) =>
      buffer.toString()
    );

    const cookies = JSON.parse(cookiesString);
    await page.setCookie(...cookies);
  }

  await page.goto(reportPageUrl);

  await navigationPromise;

  if (newLogin) {
    await page.waitForSelector(".form > #login-form #email");
    await page.type(".form > #login-form #email", username);

    await page.type(".form > #login-form #password", password);

    await page.waitForSelector(
      "#login-form > .form-group > .controls > .signin > .btn"
    );
    await page.click("#login-form > .form-group > .controls > .signin > .btn");

    await navigationPromise;
  }

  console.log("Press any key to continue...");
  await keypress();

  if (newLogin) {
    console.log("Saving cookies");
    const cookies = await page.cookies();
    await writeFile(COOKIES_PATH, JSON.stringify(cookies, null, 2));
  }

  console.log("Beginning export");

  let onLastPageAndExportedAll = false;
  let pageNum = 1;
  while (!onLastPageAndExportedAll) {
    await page.waitForSelector("#meeting_list > tbody > tr");
    const numberOfReports = (await page.$$("#meeting_list > tbody > tr"))
      .length;
    console.log(`Number of reports on page ${pageNum}: ${numberOfReports}`);

    await page.waitFor(2000);

    if (pageNum >= resumeFromPage) {
      let i = 1;

      while (i <= numberOfReports) {
        console.log(`Page ${pageNum}: exporting report ${i}...`);

        await page.waitForSelector(`#meeting_list > tbody > tr`, {
          visible: true,
        });

        await page.waitForSelector(
          `#meeting_list > tbody > tr:nth-child(${i}) > .col6 > a`,
          { visible: true }
        );
        await page.click(
          `#meeting_list > tbody > tr:nth-child(${i}) > .col6 > a`
        );

        await page.waitForSelector(
          "#contentDiv > .clearfix > div > #withMeetingHeaderDiv input",
          { visible: true }
        );
        await page.click(
          "#contentDiv > .clearfix > div > #withMeetingHeaderDiv input"
        );

        await page.waitFor(100);

        await page.waitForSelector(
          ".modal-body > #contentDiv #btnExportParticipants"
        );
        await page.click(".modal-body > #contentDiv #btnExportParticipants");

        await page.mouse.click(10, 10);

        await page.waitFor(1000);

        i += 1;
      }
    }

    console.log("Moving on to next page...");

    await page.waitForSelector(
      "#meetingList > .list-col > .dynamo_pagination > li:nth-child(2) > a"
    );
    await page.click(
      "#meetingList > .list-col > .dynamo_pagination > li:nth-child(2) > a"
    );

    await navigationPromise;

    const nextButtonDisabled =
      (await page.$(
        "#meetingList > .list-col > .dynamo_pagination > li:nth-child(2).disabled > a"
      )) !== null;

    onLastPageAndExportedAll = nextButtonDisabled;

    pageNum += 1;
  }

  console.log("Press any key to continue...");
  await keypress();

  await browser.close();
})()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => {
    console.log("Finished");
    process.exit(0);
  });
