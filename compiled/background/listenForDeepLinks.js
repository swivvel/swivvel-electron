"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const electron_1 = require("electron");
const electron_log_1 = __importDefault(require("electron-log"));
const utils_1 = require("./utils");
exports.default = (deepLinkHandler) => {
    electron_log_1.default.info(`Configuring deep linking...`);
    if (process.defaultApp) {
        electron_log_1.default.info(`process.defaultApp=true`);
        if (process.argv.length >= 2) {
            electron_log_1.default.info(`Using argument ${process.argv[1]}`);
            electron_1.app.setAsDefaultProtocolClient(`swivvel`, process.execPath, [
                path_1.default.resolve(process.argv[1]),
            ]);
        }
    }
    else {
        electron_log_1.default.info(`process.defaultApp=false`);
        electron_1.app.setAsDefaultProtocolClient(`swivvel`);
    }
    const gotTheLock = electron_1.app.requestSingleInstanceLock();
    if (!gotTheLock) {
        electron_1.app.quit();
    }
    else {
        electron_1.app.on(`second-instance`, (event, commandLine, workingDirectory) => {
            var _a;
            const url = (_a = commandLine === null || commandLine === void 0 ? void 0 : commandLine.pop()) === null || _a === void 0 ? void 0 : _a.slice(0, -1);
            const urlForLog = url ? (0, utils_1.removeQueryParams)(url) : null;
            electron_log_1.default.info(`Deep link detected from second-instance: ${urlForLog}`);
            electron_log_1.default.info(`commandLine=${commandLine}`);
            electron_log_1.default.info(`workingDirectory=${workingDirectory}`);
            electron_log_1.default.info(`url=${url}`);
            if (!url) {
                (0, utils_1.showGenericErrorMessage)({
                    errorCode: utils_1.ErrorCode.UrlMissingOnSecondInstanceDeepLink,
                });
            }
            else {
                deepLinkHandler(url);
            }
        });
        electron_1.app.on(`open-url`, (event, url) => {
            electron_log_1.default.info(`Deep link detected from open-url: ${(0, utils_1.removeQueryParams)(url)}`);
            deepLinkHandler(url);
        });
    }
    electron_log_1.default.info(`Configured deep linking`);
};
