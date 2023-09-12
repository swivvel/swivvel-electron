'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const electron_1 = require('electron');
exports.default = () => {
  return electron_1.app.isPackaged;
};
