'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const electron_1 = require('electron');
const electron_log_1 = __importDefault(require('electron-log'));
const utils_1 = require('../utils');
const pollForMouseEvents_1 = __importDefault(require('./pollForMouseEvents'));
exports.default = (state, preloadPath) =>
  __awaiter(void 0, void 0, void 0, function* () {
    electron_log_1.default.info(`Creating transparent window...`);
    // Transparent windows don't work on Linux without some hacks
    // like this short delay
    // See: https://github.com/electron/electron/issues/15947
    if ((0, utils_1.isLinux)()) {
      yield (0, utils_1.sleep)(1000);
    }
    const primaryDisplay = electron_1.screen.getPrimaryDisplay();
    const transparentWindow = new electron_1.BrowserWindow({
      alwaysOnTop: true,
      autoHideMenuBar: true,
      closable: false,
      // On Mac, the window needs to be focusable for the mouse cursor to appear
      // as a pointer. On Linux, the mouse cursor appears as a pointer on a
      // non-focusable window, but if the window is focusable then it appears
      // when using alt+tab to switch between windows.
      focusable: !(0, utils_1.isLinux)(),
      frame: false,
      hasShadow: false,
      height: primaryDisplay.workAreaSize.height,
      hiddenInMissionControl: true,
      maximizable: false,
      minimizable: false,
      resizable: false,
      roundedCorners: false,
      skipTaskbar: true,
      transparent: true,
      webPreferences: { preload: preloadPath },
      width: primaryDisplay.workAreaSize.width,
      x: 0,
      y: 0,
    });
    transparentWindow.setIgnoreMouseEvents(true, { forward: true });
    transparentWindow.setVisibleOnAllWorkspaces(true, {
      visibleOnFullScreen: true,
      // See: https://github.com/electron/electron/issues/25368
      skipTransformProcessType: true,
    });
    transparentWindow.on(`close`, (event) => {
      if (!state.allowQuit) {
        event.preventDefault();
        transparentWindow.hide();
      }
    });
    // See: https://github.com/electron/electron/issues/1335#issuecomment-1585787243
    (0, pollForMouseEvents_1.default)(transparentWindow);
    if ((0, utils_1.isProduction)()) {
      yield transparentWindow.loadURL(`https://app.swivvel.io/notifications`);
    } else {
      yield transparentWindow.loadURL(
        `${process.env.ELECTRON_APP_DEV_URL}/notifications`
      );
    }
    electron_log_1.default.info(`Created transparent window`);
    return transparentWindow;
  });
