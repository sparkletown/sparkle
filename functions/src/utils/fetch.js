const fetch = require("node-fetch");

const getJson = async (url, headers) =>
  await fetch(url, {
    method: "GET",
    headers,
  }).then((res) => res.json());

const postJson = async (url, body) =>
  await fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  }).then((res) => res.json());

exports.getJson = getJson;
exports.postJson = postJson;
