"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const electron_log_1 = __importDefault(require("electron-log"));
exports.default = (state) => {
    electron_log_1.default.info(`Preparing to quit app...`);
    state.allowQuit = true;
    electron_1.app.removeAllListeners(`window-all-closed`);
    Object.values(state).forEach((stateValue) => {
        if (stateValue && stateValue instanceof electron_1.BrowserWindow) {
            if (!stateValue.isDestroyed()) {
                stateValue.removeAllListeners(`close`);
            }
        }
    });
    electron_log_1.default.info(`Closing windows...`);
    Object.values(state).forEach((stateValue) => {
        if (stateValue && stateValue instanceof electron_1.BrowserWindow) {
            if (!stateValue.isDestroyed()) {
                stateValue.destroy();
            }
        }
    });
};
