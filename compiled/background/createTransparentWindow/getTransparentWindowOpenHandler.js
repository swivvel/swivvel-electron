"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_log_1 = __importDefault(require("electron-log"));
const utils_1 = require("../utils");
exports.default = (siteUrl, callbacks) => {
    return (url) => {
        if ((0, utils_1.removeQueryParams)(url) === `${siteUrl}/electron/login`) {
            electron_log_1.default.info(`Log in page requested`);
            callbacks.onLogInPageOpened();
            return { action: `deny` };
        }
        return null;
    };
};
