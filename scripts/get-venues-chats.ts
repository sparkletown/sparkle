#!/usr/bin/env node -r esm -r ts-node/register

import { writeFile } from "fs";
import { resolve } from "path";

import type firebase from "firebase/app";
import admin from "firebase-admin";

import { ChatMessageType, PollQuestion, PollVote } from "../src/types/chat";
import { formatDate, formatTimeLocalised } from "../src/utils/time";

import { initFirebaseAdminApp, makeScriptUsage } from "./lib/helpers";

const usage = makeScriptUsage({
  description: "Retrieve 'chats' details (in CSV format) ",
  usageParams: "PROJECT_ID VENUE_IDS [CREDENTIAL_PATH]",
  exampleParams:
    "co-reality-map venueId,venueId2,venueIdN [theMatchingAccountServiceKey.json]",
});

const [projectId, venueIds, credentialPath] = process.argv.slice(2);

if (!projectId || !venueIds) {
  usage();
}

const venueIdsArray = venueIds.split(",");

if (venueIdsArray.length > 10) {
  console.error(
    "Error: This script can only handle up to 10 venueIds at once at the moment."
  );
  console.error("  venueIdsArray.length :", venueIdsArray.length);
  process.exit(1);
}

const app = initFirebaseAdminApp(projectId, {
  credentialPath: credentialPath
    ? resolve(__dirname, credentialPath)
    : undefined,
});

const calculateVotePercentage = (item: PollQuestion, votes: PollVote[]) =>
  votes.length
    ? Math.floor(
        (votes.filter(({ questionId }) => questionId === item.id).length /
          votes.length) *
          100
      )
    : 0;

const getSenderPartyName = async (userId: string) => {
  if (!userId) return "";
  const firestoreUser = await admin
    .firestore()
    .collection("users")
    .doc(userId)
    .get();
  return firestoreUser.data()?.partyName ?? "";
};

const exportChats = async () => {
  for (let index = 0; index < venueIdsArray.length; index++) {
    const venueId = venueIdsArray[index];
    const result: string[] = [
      [
        "Date",
        "Time",
        "Type",
        "From",
        "Message body or Poll topic or question",
      ].join(","),
    ];
    const chats = await app
      .firestore()
      .collection("venues")
      .doc(venueId)
      .collection("chats")
      .get();
    for (let i = 0; i < chats.size; i++) {
      const chat = chats.docs[i];
      const isPoll = chat.data().type === ChatMessageType.poll;
      const isQuestion = chat.data().isQuestion ?? false;
      const from: string = chat.data().from;
      const text: string = chat.data().text;
      const time: firebase.firestore.Timestamp = chat.data().ts_utc;
      const partyName = await getSenderPartyName(from);
      const sendDate = formatDate(time.toMillis());
      const sendTime = formatTimeLocalised(time.toMillis());

      if (isPoll || isQuestion) {
        if (isPoll) {
          const poll = chat.data().poll;
          const votes: PollVote[] = chat.data().votes ?? [];
          const questions = poll.questions
            .map((question: PollQuestion) => [
              question.name ?? "",
              calculateVotePercentage(question, votes),
            ])
            .flat();
          result.push(
            [
              sendDate,
              sendTime,
              "Poll",
              partyName,
              text,
              poll.topic ?? "",
              ...questions,
            ]
              .map((s) => `"${s}"`)
              .join(",")
          );
        } else if (isQuestion) {
          result.push(
            [sendDate, sendTime, "Question", partyName, text]
              .map((s) => `"${s}"`)
              .join(",")
          );
        }
      } else {
        result.push(
          [sendDate, sendTime, "Message", partyName, text]
            .map((s) => `"${s}"`)
            .join(",")
        );
      }
    }
    const filePath = "chats-" + venueId + ".csv";
    const content = result.join("\r\n");
    writeFile(filePath, content, () => {});
  }
};

exportChats();
