"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const electron_deeplink_1 = require("electron-deeplink");
const utils_1 = require("./utils");
exports.default = (transparentWindow) => {
    const protocol = (0, utils_1.isProduction)() ? `swivvel` : `swivvel-dev`;
    const deeplink = new electron_deeplink_1.Deeplink({
        app: electron_1.app,
        mainWindow: transparentWindow,
        protocol,
        isDev: !utils_1.isProduction,
    });
    deeplink.on(`received`, (link) => {
    });
};
