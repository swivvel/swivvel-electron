'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const electron_1 = require('electron');
const electron_log_1 = __importDefault(require('electron-log'));
exports.default = (state) => {
  var _a, _b, _c, _d, _e, _f;
  electron_log_1.default.info(`Preparing to quit app...`);
  state.allowQuit = true;
  electron_1.app.removeAllListeners(`window-all-closed`);
  (_a = state.hqWindow) === null || _a === void 0
    ? void 0
    : _a.removeAllListeners(`close`);
  (_b = state.setupWindow) === null || _b === void 0
    ? void 0
    : _b.removeAllListeners(`close`);
  (_c = state.transparentWindow) === null || _c === void 0
    ? void 0
    : _c.removeAllListeners(`close`);
  electron_log_1.default.info(`Closing windows...`);
  (_d = state.hqWindow) === null || _d === void 0 ? void 0 : _d.destroy();
  (_e = state.setupWindow) === null || _e === void 0 ? void 0 : _e.destroy();
  (_f = state.transparentWindow) === null || _f === void 0
    ? void 0
    : _f.destroy();
};
