"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const electron_deeplink_1 = require("electron-deeplink");
const electron_log_1 = __importDefault(require("electron-log"));
const utils_1 = require("./utils");
exports.default = (transparentWindow) => {
    electron_log_1.default.info(`Configuring deep linking...`);
    const protocol = (0, utils_1.isProduction)() ? `swivvel` : `swivvel-dev`;
    const deeplink = new electron_deeplink_1.Deeplink({
        app: electron_1.app,
        mainWindow: transparentWindow,
        protocol,
        isDev: !utils_1.isProduction,
    });
    deeplink.on(`received`, (link) => {
    });
    electron_log_1.default.info(`Configured deep linking`);
};
