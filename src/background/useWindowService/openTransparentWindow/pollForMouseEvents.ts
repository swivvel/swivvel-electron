import { BrowserWindow, ipcMain, screen } from 'electron';
import log from 'electron-log';

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
export default (transparentWindow: BrowserWindow): void => {
  transparentWindow.setIgnoreMouseEvents(true, { forward: true });

  ipcMain.on(`log`, (event, msg: string): void => {
    console.log(msg);
    transparentWindow.setIgnoreMouseEvents(msg === `true`, { forward: true });
  });

  /*
  let mouseIsOverTransparentPrevious: boolean | null = null;

  const interval = setInterval(async () => {
    if (transparentWindow.isDestroyed()) {
      clearInterval(interval);
      return;
    }

    const point = screen.getCursorScreenPoint();
    const [x, y] = transparentWindow.getPosition();
    const [w, h] = transparentWindow.getSize();

    if (transparentWindow.isDestroyed()) {
      clearInterval(interval);
      return;
    }

    if (point.x > x && point.x < x + w && point.y > y && point.y < y + h) {
      const mouseX = point.x - x;
      const mouseY = point.y - y;

      if (transparentWindow.isDestroyed()) {
        clearInterval(interval);
        return;
      }

      // Capture 1x1 image of mouse position
      const capture = { x: mouseX, y: mouseY, width: 1, height: 1 };
      const image = await transparentWindow.webContents.capturePage(capture);
      const buffer = image.getBitmap();
      const mouseIsOverTransparent = buffer[3] === 0;

      if (transparentWindow.isDestroyed()) {
        clearInterval(interval);
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
  }, 50);
  */
};
