import { default as fetch } from "node-fetch";

export const getJson = async (url: string, headers: Object) =>
  await fetch(url, {
    method: "GET",
    headers,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
  }).then((res) => res.json());

export const postJson = async (url: string, body: Object) =>
  await fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
  }).then((res) => res.json());
