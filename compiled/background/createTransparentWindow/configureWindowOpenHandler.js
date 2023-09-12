"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_log_1 = __importDefault(require("electron-log"));
const utils_1 = require("../utils");
exports.default = (transparentWindow, siteUrl, callbacks) => {
    electron_log_1.default.info(`  Configuring window open handler...`);
    transparentWindow.webContents.setWindowOpenHandler(({ url }) => {
        electron_log_1.default.info(`!!!! configureWindowOpenHandler`);
        electron_log_1.default.info(url);
        electron_log_1.default.info(`!!!!`);
        if (url === `${siteUrl}/electron/login`) {
            callbacks.onLogInPageOpened();
            return { action: `deny` };
        }
        return (0, utils_1.getBaseWindowOpenHandler)(url, siteUrl);
    });
};
