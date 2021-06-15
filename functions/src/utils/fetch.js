const fetch = require("node-fetch");

const postJson = async (url, body) =>
  await fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  }).then((res) => res.json());

exports.postJson = postJson;
