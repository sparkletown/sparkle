import fetch, { HeadersInit } from "node-fetch";

export const getJson = async <T>(url: string, headers: HeadersInit) =>
  (await fetch(url, {
    method: "GET",
    headers,
  }).then((res) => res.json())) as T;

export const postJson = async <T>(url: string, body: Record<string, unknown>) =>
  (await fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  }).then((res) => res.json())) as T;
