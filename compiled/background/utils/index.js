'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.sleep =
  exports.quitApp =
  exports.prepareToQuitApp =
  exports.isProduction =
  exports.isLinux =
    void 0;
const isLinux_1 = __importDefault(require('./isLinux'));
exports.isLinux = isLinux_1.default;
const isProduction_1 = __importDefault(require('./isProduction'));
exports.isProduction = isProduction_1.default;
const prepareToQuitApp_1 = __importDefault(require('./prepareToQuitApp'));
exports.prepareToQuitApp = prepareToQuitApp_1.default;
const quitApp_1 = __importDefault(require('./quitApp'));
exports.quitApp = quitApp_1.default;
const sleep_1 = __importDefault(require('./sleep'));
exports.sleep = sleep_1.default;
