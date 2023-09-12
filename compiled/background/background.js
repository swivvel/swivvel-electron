"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const electron_1 = require("electron");
const electron_log_1 = __importDefault(require("electron-log"));
const configureApp_1 = __importDefault(require("./configureApp"));
const configureAppQuitHandling_1 = __importDefault(require("./configureAppQuitHandling"));
const configureAutoUpdates_1 = __importDefault(require("./configureAutoUpdates"));
const configureDeepLinking_1 = __importDefault(require("./configureDeepLinking"));
const configureWindowOpenHandler_1 = __importDefault(require("./configureWindowOpenHandler"));
const createTransparentWindow_1 = __importDefault(require("./createTransparentWindow"));
const createTray_1 = __importDefault(require("./createTray"));
const getSiteUrl_1 = __importDefault(require("./getSiteUrl"));
const pollForIdleTime_1 = __importDefault(require("./pollForIdleTime"));
const PRELOAD_PATH = path_1.default.join(__dirname, `..`, `preload.js`);
const LOGO_TEMPLATE_PATH = path_1.default.join(__dirname, `..`, `logoTemplate.png`);
const SITE_URL = (0, getSiteUrl_1.default)();
const run = async () => {
    electron_log_1.default.info(`App starting...`);
    const state = {
        allowQuit: false,
        hqWindow: null,
        setupWindow: null,
        transparentWindow: null,
    };
    (0, configureApp_1.default)();
    await (0, configureDeepLinking_1.default)(state);
    await electron_1.app.whenReady();
    if (electron_1.systemPreferences.askForMediaAccess) {
        await electron_1.systemPreferences.askForMediaAccess(`microphone`);
    }
    const transparentWindow = await (0, createTransparentWindow_1.default)(state, PRELOAD_PATH, SITE_URL);
    state.transparentWindow = transparentWindow;
    (0, configureAppQuitHandling_1.default)(state);
    (0, configureWindowOpenHandler_1.default)(transparentWindow, SITE_URL);
    (0, createTray_1.default)(state, LOGO_TEMPLATE_PATH);
    (0, configureAutoUpdates_1.default)(state);
    (0, pollForIdleTime_1.default)(transparentWindow);
    electron_log_1.default.info(`App started`);
};
run();
