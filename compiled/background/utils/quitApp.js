"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const electron_log_1 = __importDefault(require("electron-log"));
const prepareToQuitApp_1 = __importDefault(require("./prepareToQuitApp"));
exports.default = (state, options) => {
    (0, prepareToQuitApp_1.default)(state);
    const quitAndInstall = Boolean(options && options.quitAndInstall);
    if (quitAndInstall) {
        electron_log_1.default.info(`Quitting app and installing updates`);
        electron_1.autoUpdater.quitAndInstall();
    }
    else {
        electron_log_1.default.info(`Quitting app`);
        electron_1.app.quit();
    }
};
