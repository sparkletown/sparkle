import fetch from "node-fetch";

export const getJson = async (url, headers) =>
  await fetch(url, {
    method: "GET",
    headers,
  }).then((res) => res.json());

export const postJson = async (url, body) =>
  await fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  }).then((res) => res.json());
