"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorCode = void 0;
const electron_1 = require("electron");
var ErrorCode;
(function (ErrorCode) {
    ErrorCode["UrlMissingOnSecondInstanceDeepLink"] = "1000";
})(ErrorCode || (exports.ErrorCode = ErrorCode = {}));
exports.default = ({ errorCode }) => {
    electron_1.dialog.showErrorBox(`Something went wrong`, `Please contact support@swivvel.io and provide the following error code: ${errorCode}.`);
};
