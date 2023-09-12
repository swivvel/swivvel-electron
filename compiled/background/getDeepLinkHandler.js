"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_log_1 = __importDefault(require("electron-log"));
const createLogInWindow_1 = __importDefault(require("./createLogInWindow"));
const convertDeeplinkUrlToHttps = (url) => {
    return url.replace(/^swivvel:\/\//, `https://`);
};
exports.default = (state, preloadPath, siteUrl) => {
    return async (url) => {
        if (url.includes(`/api/auth/callback`)) {
            electron_log_1.default.info(`Running log in callback handler...`);
            let logInWindow;
            if (state.logInWindow && !state.logInWindow.isDestroyed()) {
                logInWindow = state.logInWindow;
            }
            else {
                electron_log_1.default.info(`Log in window missing, recreating...`);
                logInWindow = await (0, createLogInWindow_1.default)(preloadPath, siteUrl);
                electron_log_1.default.info(`Recreated log in window`);
            }
            electron_log_1.default.info(`Loading OAuth callback URL into log in window...`);
            await logInWindow.loadURL(convertDeeplinkUrlToHttps(url));
            electron_log_1.default.info(`Loaded OAuth callback URL into log in window`);
        }
    };
};
