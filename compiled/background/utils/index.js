"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = exports.showGenericErrorMessage = exports.removeQueryParams = exports.quitApp = exports.prepareToQuitApp = exports.makeBrowserWindow = exports.loadInternalUrl = exports.isProduction = exports.isLinux = exports.ErrorCode = void 0;
const isLinux_1 = __importDefault(require("./isLinux"));
exports.isLinux = isLinux_1.default;
const isProduction_1 = __importDefault(require("./isProduction"));
exports.isProduction = isProduction_1.default;
const loadInternalUrl_1 = __importDefault(require("./loadInternalUrl"));
exports.loadInternalUrl = loadInternalUrl_1.default;
const makeBrowserWindow_1 = __importDefault(require("./makeBrowserWindow"));
exports.makeBrowserWindow = makeBrowserWindow_1.default;
const prepareToQuitApp_1 = __importDefault(require("./prepareToQuitApp"));
exports.prepareToQuitApp = prepareToQuitApp_1.default;
const quitApp_1 = __importDefault(require("./quitApp"));
exports.quitApp = quitApp_1.default;
const removeQueryParams_1 = __importDefault(require("./removeQueryParams"));
exports.removeQueryParams = removeQueryParams_1.default;
const showGenericErrorMessage_1 = __importStar(require("./showGenericErrorMessage"));
exports.showGenericErrorMessage = showGenericErrorMessage_1.default;
Object.defineProperty(exports, "ErrorCode", { enumerable: true, get: function () { return showGenericErrorMessage_1.ErrorCode; } });
const sleep_1 = __importDefault(require("./sleep"));
exports.sleep = sleep_1.default;
