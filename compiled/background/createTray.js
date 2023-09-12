"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const electron_log_1 = __importDefault(require("electron-log"));
const utils_1 = require("./utils");
exports.default = (state, logoTemplatePath) => {
    electron_log_1.default.info(`Creating tray...`);
    const tray = new electron_1.Tray(logoTemplatePath);
    const contextMenu = electron_1.Menu.buildFromTemplate([
        {
            label: `Quit`,
            type: `normal`,
            click: () => {
                (0, utils_1.quitApp)(state);
            },
        },
    ]);
    tray.setContextMenu(contextMenu);
    electron_log_1.default.info(`Created tray`);
};
