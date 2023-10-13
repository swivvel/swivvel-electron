import { BrowserWindow, screen } from 'electron';
import log from 'electron-log';

export default (transparentWindow: BrowserWindow): (() => Promise<void>) => {
  let mouseIsOverTransparentPrevious: boolean | null = null;

  return async () => {
    console.log(`mouseIgnoreHandler`);
    if (transparentWindow.isDestroyed()) {
      return;
    }

    const point = screen.getCursorScreenPoint();
    const [x, y] = transparentWindow.getPosition();
    const [w, h] = transparentWindow.getSize();

    if (transparentWindow.isDestroyed()) {
      return;
    }

    if (point.x > x && point.x < x + w && point.y > y && point.y < y + h) {
      const mouseX = point.x - x;
      const mouseY = point.y - y;

      if (transparentWindow.isDestroyed()) {
        return;
      }

      // Capture 1x1 image of mouse position
      const capture = { x: mouseX, y: mouseY, width: 1, height: 1 };
      const image = await transparentWindow.webContents.capturePage(capture);
      const buffer = image.getBitmap();
      const mouseIsOverTransparent = buffer[3] === 0;

      if (transparentWindow.isDestroyed()) {
        return;
      }

      transparentWindow.setIgnoreMouseEvents(mouseIsOverTransparent);

      if (mouseIsOverTransparent !== mouseIsOverTransparentPrevious) {
        log.info(
          `Mouse is over transparent: ${mouseIsOverTransparentPrevious} -> ${mouseIsOverTransparent}`
        );
      }

      mouseIsOverTransparentPrevious = mouseIsOverTransparent;
    }
  };
};
