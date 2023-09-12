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
Object.defineProperty(exports, '__esModule', { value: true });
const electron_1 = require('electron');
exports.default = (transparentWindow) => {
  const interval = setInterval(
    () =>
      __awaiter(void 0, void 0, void 0, function* () {
        if (transparentWindow.isDestroyed()) {
          clearInterval(interval);
          return;
        }
        const point = electron_1.screen.getCursorScreenPoint();
        const [x, y] = transparentWindow.getPosition();
        const [w, h] = transparentWindow.getSize();
        if (point.x > x && point.x < x + w && point.y > y && point.y < y + h) {
          const mouseX = point.x - x;
          const mouseY = point.y - y;
          const capture = { x: mouseX, y: mouseY, width: 1, height: 1 };
          const image =
            yield transparentWindow.webContents.capturePage(capture);
          const buffer = image.getBitmap();
          const mouseIsOverTransparent = buffer[3] === 0;
          transparentWindow.setIgnoreMouseEvents(mouseIsOverTransparent);
        }
      }),
    50
  );
};
