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
/**
 * Support mouse events on the transparent notification window.
 *
 * The transparent notification window is always on top of all other windows,
 * so we need to ignore mouse events by default. When the user's cursor moves
 * over an element that we rendered in the notification window, we need to stop
 * ignoring mouse events so that the user can interact with the element.
 *
 * There are a few strategies to accomplish this, but the most reliable we found
 * was https://github.com/electron/electron/issues/1335#issuecomment-1585787243.
 * This works by periodically capturing a 1x1 image of the pixel at the user's
 * current cursor position. If the pixel is transparent, then the user's cursor
 * is over a transparent part of the window and we should ignore mouse events.
 * If the pixel is not transparent, then the user's cursor is over a non-
 * transparent part of the window and we should not ignore mouse events.
 */
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
          // Capture 1x1 image of mouse position
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
