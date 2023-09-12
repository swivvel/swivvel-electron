"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
exports.default = () => {
    if ((0, utils_1.isProduction)()) {
        return `https://app.localhost.architect.sh`;
    }
    const appDevUrl = process.env.ELECTRON_APP_DEV_URL;
    if (!appDevUrl) {
        throw new Error(`Missing environment variable: ELECTRON_APP_DEV_URL`);
    }
    return appDevUrl;
};
