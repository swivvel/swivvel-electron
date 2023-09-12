"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_app_universal_protocol_client_1 = __importDefault(require("electron-app-universal-protocol-client"));
const electron_log_1 = __importDefault(require("electron-log"));
const utils_1 = require("./utils");
exports.default = async () => {
    electron_log_1.default.info(`Configuring deep linking...`);
    Promise;
    electron_app_universal_protocol_client_1.default.on(`request`, (requestUrl) => {
        console.log(`electronAppUniversalProtocolClient`);
        console.log(requestUrl);
    });
    await electron_app_universal_protocol_client_1.default.initialize({
        protocol: `swivvel`,
        mode: (0, utils_1.isProduction)() ? `production` : `development`,
    });
    electron_log_1.default.info(`Configured deep linking`);
};
