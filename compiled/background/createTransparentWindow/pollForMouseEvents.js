"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
exports.default = (transparentWindow) => {
    const interval = setInterval(async () => {
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
            const image = await transparentWindow.webContents.capturePage(capture);
            const buffer = image.getBitmap();
            const mouseIsOverTransparent = buffer[3] === 0;
            transparentWindow.setIgnoreMouseEvents(mouseIsOverTransparent);
        }
    }, 50);
};
