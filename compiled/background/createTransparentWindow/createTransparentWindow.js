"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const electron_log_1 = __importDefault(require("electron-log"));
const utils_1 = require("../utils");
exports.default = async (state, preloadPath, siteUrl) => {
    electron_log_1.default.info(`Creating transparent window...`);
    if ((0, utils_1.isLinux)()) {
        await (0, utils_1.sleep)(1000);
    }
    electron_log_1.default.info(`  Creating transparent window BrowserWindow...`);
    const primaryDisplay = electron_1.screen.getPrimaryDisplay();
    const transparentWindow = new electron_1.BrowserWindow({
        webPreferences: { preload: preloadPath },
    });
    electron_log_1.default.info(`  Setting up transparent window handlers...`);
    transparentWindow.webContents.setWindowOpenHandler(({ url }) => {
        electron_log_1.default.info(`XXXXX`);
        electron_log_1.default.info(url);
        electron_log_1.default.info(`XXXXX`);
        return { action: `allow` };
    });
    transparentWindow.on(`close`, (event) => {
        if (!state.allowQuit) {
            event.preventDefault();
            transparentWindow.hide();
        }
    });
    const url = `${siteUrl}/notifications`;
    electron_log_1.default.info(`  Loading Swivvel URL: ${url}`);
    await transparentWindow.loadURL(url);
    transparentWindow.webContents.openDevTools();
    electron_log_1.default.info(`Created transparent window`);
    return transparentWindow;
};
