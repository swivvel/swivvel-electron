'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
/**
 * Pause execution for the given number of milliseconds.
 */
exports.default = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};
