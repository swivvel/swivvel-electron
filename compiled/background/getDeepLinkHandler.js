"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const utils_1 = require("./utils");
exports.default = (state) => {
    return (url) => {
        electron_1.dialog.showErrorBox(`Welcome Back`, `You arrived from: ${url}`);
        if (url.includes(`/api/auth/callback`)) {
            if (state.logInWindow) {
                state.logInWindow.close();
            }
            if (state.transparentWindow) {
                state.transparentWindow.reload();
            }
            else {
                (0, utils_1.showGenericErrorMessage)({
                    errorCode: utils_1.ErrorCode.TransparentWindowMissingOnDeepLink,
                });
            }
        }
    };
};
