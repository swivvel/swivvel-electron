"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const electron_1 = require("electron");
const electron_log_1 = __importDefault(require("electron-log"));
exports.default = async (state) => {
    electron_log_1.default.info(`Configuring deep linking...`);
    if (process.defaultApp) {
        electron_log_1.default.info(`  process.defaultApp=true`);
        if (process.argv.length >= 2) {
            electron_log_1.default.info(`  Using argument ${process.argv[1]}`);
            electron_1.app.setAsDefaultProtocolClient(`swivvel`, process.execPath, [
                path_1.default.resolve(process.argv[1]),
            ]);
        }
    }
    else {
        electron_log_1.default.info(`  process.defaultApp=false`);
        electron_1.app.setAsDefaultProtocolClient(`swivvel`);
    }
    const gotTheLock = electron_1.app.requestSingleInstanceLock();
    if (!gotTheLock) {
        electron_1.app.quit();
    }
    else {
        electron_1.app.on(`second-instance`, (event, commandLine, workingDirectory) => {
            var _a;
            console.log(`!!!!!!!!!! second-instance`);
            console.log(event);
            console.log(commandLine);
            console.log(workingDirectory);
            electron_1.dialog.showErrorBox(`Welcome Back`, `You arrived from: ${(_a = commandLine === null || commandLine === void 0 ? void 0 : commandLine.pop()) === null || _a === void 0 ? void 0 : _a.slice(0, -1)}`);
        });
        electron_1.app.on(`open-url`, (event, url) => {
            if (state.transparentWindow) {
                electron_log_1.default.info(state.transparentWindow.webContents.mainFrame.framesInSubtree.map((x) => {
                    return x.name;
                }));
            }
            else {
                electron_1.dialog.showErrorBox(`Something went wrong`, `Please contact support@swivvel.io`);
            }
            electron_1.dialog.showErrorBox(`Welcome Back`, `You arrived from: ${url}`);
        });
    }
    electron_log_1.default.info(`Configured deep linking`);
};
