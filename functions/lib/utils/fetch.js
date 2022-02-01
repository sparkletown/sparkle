"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postJson = exports.getJson = void 0;
const node_fetch_1 = require("node-fetch");
const getJson = async (url, headers) => await (0, node_fetch_1.default)(url, {
    method: "GET",
    headers,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
}).then((res) => res.json());
exports.getJson = getJson;
const postJson = async (url, body) => await (0, node_fetch_1.default)(url, {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
}).then((res) => res.json());
exports.postJson = postJson;
//# sourceMappingURL=fetch.js.map