"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const electron_log_1 = __importDefault(require("electron-log"));
const utils_1 = require("./utils");
exports.default = (state) => {
    electron_1.powerMonitor.on(`shutdown`, () => {
        electron_log_1.default.info(`System shutdown detected`);
        (0, utils_1.quitApp)(state);
    });
};
