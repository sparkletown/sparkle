"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidUrl = exports.VALID_URL_PROTOCOLS = void 0;
exports.VALID_URL_PROTOCOLS = ["https:"];
const isValidUrl = (urlString) => {
    if (!urlString)
        return false;
    try {
        const url = new URL(urlString);
        return exports.VALID_URL_PROTOCOLS.includes(url.protocol);
    }
    catch (e) {
        // eslint-disable-next-line
        // @ts-ignore
        if ((e === null || e === void 0 ? void 0 : e.name) === "TypeError") {
            return false;
        }
        throw e;
    }
};
exports.isValidUrl = isValidUrl;
//# sourceMappingURL=url.js.map