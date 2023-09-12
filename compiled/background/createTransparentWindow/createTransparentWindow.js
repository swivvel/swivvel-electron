"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const electron_log_1 = __importDefault(require("electron-log"));
const utils_1 = require("../utils");
const pollForMouseEvents_1 = __importDefault(require("./pollForMouseEvents"));
exports.default = async (state, preloadPath) => {
    electron_log_1.default.info(`Creating transparent window...`);
    if ((0, utils_1.isLinux)()) {
        await (0, utils_1.sleep)(1000);
    }
    electron_log_1.default.info(`  Creating transparent window BrowserWindow...`);
    const primaryDisplay = electron_1.screen.getPrimaryDisplay();
    const transparentWindow = new electron_1.BrowserWindow({
        hasShadow: false,
        height: primaryDisplay.workAreaSize.height,
        hiddenInMissionControl: true,
        maximizable: false,
        minimizable: false,
        resizable: false,
        roundedCorners: false,
        webPreferences: { preload: preloadPath },
        width: primaryDisplay.workAreaSize.width,
        x: 0,
        y: 0,
    });
    electron_log_1.default.info(`  Setting up transparent window handlers...`);
    transparentWindow.setIgnoreMouseEvents(true, { forward: true });
    transparentWindow.setVisibleOnAllWorkspaces(true, {
        visibleOnFullScreen: true,
        skipTransformProcessType: true,
    });
    transparentWindow.on(`close`, (event) => {
        if (!state.allowQuit) {
            event.preventDefault();
            transparentWindow.hide();
        }
    });
    (0, pollForMouseEvents_1.default)(transparentWindow);
    electron_log_1.default.info(`  Loading Swivvel URL...`);
    if ((0, utils_1.isProduction)()) {
        await transparentWindow.loadURL(`https://app.swivvel.io/notifications`);
    }
    else {
        await transparentWindow.loadURL(`${process.env.ELECTRON_APP_DEV_URL}/notifications`);
        transparentWindow.webContents.openDevTools();
    }
    electron_log_1.default.info(`Created transparent window`);
    return transparentWindow;
};
