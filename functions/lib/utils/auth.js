"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOAuth2Client = void 0;
const simple_oauth2_1 = require("simple-oauth2");
/**
 * Create a configured simple-oauth2 client.
 *
 * @see https://github.com/lelylan/simple-oauth2/blob/3.x/API.md#createoptions--module
 */
const createOAuth2Client = ({ clientId, clientSecret, tokenHost, tokenPath, revokePath, authorizeHost, authorizePath, }) => {
    const credentials = {
        client: {
            id: clientId,
            secret: clientSecret,
        },
        auth: {
            tokenHost,
            tokenPath,
            revokePath,
            authorizeHost,
            authorizePath,
        },
    };
    return simple_oauth2_1.default.create(credentials);
};
exports.createOAuth2Client = createOAuth2Client;
//# sourceMappingURL=auth.js.map