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
exports.default = (transparentWindow) => {
  electron_log_1.default.info(`Configuring idle time polling...`);
  let isIdle = false;
  const interval = setInterval(
    () =>
      __awaiter(void 0, void 0, void 0, function* () {
        if (transparentWindow.isDestroyed()) {
          clearInterval(interval);
          return;
        }
        const newIsIdle = electron_1.powerMonitor.getSystemIdleTime() > 30;
        if (newIsIdle !== isIdle) {
          isIdle = newIsIdle;
          transparentWindow.webContents.send(`isIdle`, isIdle);
        }
      }),
    1000
  );
  electron_log_1.default.info(`Configured idle time polling`);
};
