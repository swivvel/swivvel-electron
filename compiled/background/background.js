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
const path_1 = __importDefault(require("path"));
const electron_1 = require("electron");
const electron_log_1 = __importDefault(require("electron-log"));
const configureApp_1 = __importDefault(require("./configureApp"));
const configureAutoUpdates_1 = __importDefault(require("./configureAutoUpdates"));
const configureDeepLinking_1 = __importDefault(require("./configureDeepLinking"));
const createTransparentWindow_1 = __importDefault(require("./createTransparentWindow"));
const createTray_1 = __importDefault(require("./createTray"));
const handleSystemShutdown_1 = __importDefault(require("./handleSystemShutdown"));
const pollForIdleTime_1 = __importDefault(require("./pollForIdleTime"));
const PRELOAD_PATH = path_1.default.join(__dirname, `..`, `preload.js`);
const LOGO_TEMPLATE_PATH = path_1.default.join(__dirname, `..`, `logoTemplate.png`);
const run = () => __awaiter(void 0, void 0, void 0, function* () {
    electron_log_1.default.info(`App starting...`);
    const state = {
        allowQuit: false,
        hqWindow: null,
        setupWindow: null,
        transparentWindow: null,
    };
    (0, configureApp_1.default)(state);
    yield electron_1.app.whenReady();
    if (electron_1.systemPreferences.askForMediaAccess) {
        yield electron_1.systemPreferences.askForMediaAccess(`microphone`);
    }
    const transparentWindow = yield (0, createTransparentWindow_1.default)(state, PRELOAD_PATH);
    state.transparentWindow = transparentWindow;
    (0, createTray_1.default)(state, LOGO_TEMPLATE_PATH);
    (0, configureDeepLinking_1.default)(transparentWindow);
    (0, configureAutoUpdates_1.default)(state);
    (0, pollForIdleTime_1.default)(transparentWindow);
    (0, handleSystemShutdown_1.default)(state);
    electron_log_1.default.info(`App started`);
});
run();