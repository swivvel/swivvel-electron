"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const electron_log_1 = __importDefault(require("electron-log"));
const utils_1 = require("../utils");
const pollForMouseEvents_1 = __importDefault(require("./pollForMouseEvents"));
exports.default = (state, preloadPath) => __awaiter(void 0, void 0, void 0, function* () {
    electron_log_1.default.info(`Creating transparent window...`);
    if ((0, utils_1.isLinux)()) {
        yield (0, utils_1.sleep)(1000);
    }
    electron_log_1.default.info(`  Creating transparent window BrowserWindow...`);
    const primaryDisplay = electron_1.screen.getPrimaryDisplay();
    const transparentWindow = new electron_1.BrowserWindow({
        alwaysOnTop: true,
        autoHideMenuBar: true,
        closable: false,
        focusable: !(0, utils_1.isLinux)(),
        frame: false,
        hasShadow: false,
        height: primaryDisplay.workAreaSize.height,
        hiddenInMissionControl: true,
        maximizable: false,
        minimizable: false,
        resizable: false,
        roundedCorners: false,
        skipTaskbar: true,
        transparent: true,
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
        yield transparentWindow.loadURL(`https://app.swivvel.io/notifications`);
    }
    else {
        yield transparentWindow.loadURL(`${process.env.ELECTRON_APP_DEV_URL}/notifications`);
        transparentWindow.webContents.openDevTools();
    }
    electron_log_1.default.info(`Created transparent window`);
    return transparentWindow;
});
