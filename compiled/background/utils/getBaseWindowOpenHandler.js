"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
exports.default = (targetUrl, siteUrl) => {
    if (targetUrl.startsWith(siteUrl)) {
        if (targetUrl.endsWith(`.html`)) {
            electron_1.shell.openExternal(targetUrl);
            return { action: `deny` };
        }
        return { action: `allow` };
    }
    electron_1.shell.openExternal(targetUrl);
    return { action: `deny` };
};
