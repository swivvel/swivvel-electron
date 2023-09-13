"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_log_1 = __importDefault(require("electron-log"));
const utils_1 = require("../utils");
const configureCloseHandler_1 = __importDefault(require("./configureCloseHandler"));
const getTransparentBrowserWindowOptions_1 = __importDefault(require("./getTransparentBrowserWindowOptions"));
const getTransparentWindowOpenHandler_1 = __importDefault(require("./getTransparentWindowOpenHandler"));
const pollForMouseEvents_1 = __importDefault(require("./pollForMouseEvents"));
const showOnAllWorkspaces_1 = __importDefault(require("./showOnAllWorkspaces"));
exports.default = async (state, preloadPath, siteUrl, callbacks) => {
    electron_log_1.default.info(`Creating transparent window...`);
    if ((0, utils_1.isLinux)()) {
        await (0, utils_1.sleep)(1000);
    }
    const transparentWindow = (0, utils_1.makeBrowserWindow)(siteUrl, {
        browserWindowOptions: (0, getTransparentBrowserWindowOptions_1.default)(preloadPath),
        windowOpenHandler: (0, getTransparentWindowOpenHandler_1.default)(siteUrl, callbacks),
    });
    (0, showOnAllWorkspaces_1.default)(transparentWindow);
    (0, configureCloseHandler_1.default)(transparentWindow, state);
    (0, pollForMouseEvents_1.default)(transparentWindow);
    await (0, utils_1.loadInternalUrl)(transparentWindow, siteUrl, `/notifications`);
    electron_log_1.default.info(`Created transparent window`);
    return transparentWindow;
};
