"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_log_1 = __importDefault(require("electron-log"));
exports.default = async (browserWindow, siteUrl, relativePath) => {
    const url = `${siteUrl}${relativePath}`;
    electron_log_1.default.info(`Loading Swivvel URL: ${url}`);
    await browserWindow.loadURL(url);
};
