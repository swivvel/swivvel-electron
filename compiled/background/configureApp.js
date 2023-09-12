"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const electron_log_1 = __importDefault(require("electron-log"));
const utils_1 = require("./utils");
exports.default = () => {
    electron_log_1.default.info(`Configuring app...`);
    if (!(0, utils_1.isProduction)()) {
        electron_1.app.setPath(`userData`, `${electron_1.app.getPath(`userData`)}-development`);
    }
    if ((0, utils_1.isLinux)()) {
        electron_1.app.commandLine.appendSwitch(`enable-transparent-visuals`);
        electron_1.app.commandLine.appendSwitch(`disable-gpu`);
        electron_1.app.disableHardwareAcceleration();
    }
    electron_1.app.setLoginItemSettings({ openAtLogin: true });
    electron_log_1.default.info(`Configured app`);
};
