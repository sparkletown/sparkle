#!/usr/bin/env node -r esm -r ts-node/register
import { initFirebaseAdminApp, makeScriptUsage } from "./lib/helpers";
import admin from "firebase-admin";
import * as path from "path";
import * as fs from "fs";
import { FormatterOptionsArgs, Row, writeToStream } from "@fast-csv/format";

type CsvFileOpts = {
  headers: string[];
  path: string;
};

class CsvFile {
  static write(
    stream: NodeJS.WritableStream,
    rows: Row[],
    options: FormatterOptionsArgs<Row, Row>
  ): Promise<void> {
    return new Promise((res, rej) => {
      writeToStream(stream, rows, options)
        .on("error", (err: Error) => rej(err))
        .on("finish", () => res());
    });
  }

  private readonly headers: string[];

  private readonly path: string;

  private readonly writeOpts: FormatterOptionsArgs<Row, Row>;

  constructor(opts: CsvFileOpts) {
    this.headers = opts.headers;
    this.path = opts.path;
    this.writeOpts = { headers: this.headers, quote: true };
  }

  create(rows: Row[]): Promise<void> {
    return CsvFile.write(fs.createWriteStream(this.path), rows, {
      ...this.writeOpts,
    });
  }
}

const usage = makeScriptUsage({
  description: "Bulk upload events from a spreadsheet ",
  usageParams: "PROJECT_ID CREDENTIAL_PATH",
  exampleParams: "co-reality-staging add-event-by-csv.example.csv key.json",
});

const [projectId, credentialPath] = process.argv.slice(2);

if (!credentialPath) {
  usage();
}

initFirebaseAdminApp(projectId, {
  credentialPath: credentialPath
    ? path.resolve(__dirname, credentialPath)
    : undefined,
});

const runner = async () => {
  const allUsers: admin.auth.UserRecord[] = [];
  let nextPageToken: string | undefined;
  const { users, pageToken } = await admin.auth().listUsers(10);

  allUsers.push(...users);
  nextPageToken = pageToken;

  while (nextPageToken) {
    const { users, pageToken } = await admin
      .auth()
      .listUsers(1000, nextPageToken);
    allUsers.push(...users);
    nextPageToken = pageToken;
  }

  let headers = [
    "Email",
    "Party Name",
    "Full name",
    "Company title",
    "Company department",
    "Ask me about:",
    "I'm loving this song - book - show: ",
    "I've been at GitHub for:",
    "The best part of my role at GitHub is:",
    "When not working I'm often:",
    "Last Sign In",
  ];

  const csvFile = new CsvFile({
    path: path.resolve(
      __dirname,
      "users-report-" + new Date().getTime() + ".csv"
    ),
    headers: headers,
  });

  let rows: Row[] = [];
  const firestoreUsers = await admin.firestore().collection("users").get();
  firestoreUsers.docs.forEach(async (doc) => {
    const user = allUsers.find((u) => u.uid === doc.id);
    const partyName = doc.data().partyName;
    const realName = doc.data().realName;
    const companyTitle = doc.data().companyTitle;
    const companyDepartment = doc.data().companyDepartment;
    const Q1 = doc.data()[headers[5]];
    const Q2 = doc.data()[headers[6]];
    const Q3 = doc.data()[headers[7]];
    const Q4 = doc.data()[headers[8]];
    const Q5 = doc.data()[headers[9]];
    const lastSignInTime = new Date(doc.data().lastSeenAt).getTime();
    rows.push({
      [headers[0]]: user?.email ?? doc.id,
      [headers[1]]: partyName,
      [headers[2]]: realName,
      [headers[3]]: companyTitle,
      [headers[4]]: companyDepartment,
      [headers[5]]: Q1,
      [headers[6]]: Q2,
      [headers[7]]: Q3,
      [headers[8]]: Q4,
      [headers[9]]: Q5,
      [headers[10]]: lastSignInTime
        ? new Date(lastSignInTime).toISOString()
        : "ٔٔNever",
    });
  });
  await csvFile.create(rows);
  console.log("File generated sucessfuly!");
  process.exit(0);
};

runner();
