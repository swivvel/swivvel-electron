import { BrowserWindow, ipcMain, screen } from 'electron';
import log from 'electron-log';

import { isMac } from '../../utils';

/**
 * Support mouse events on the transparent notification window.
 *
 * The transparent notification window is always on top of all other windows,
 * so we need to ignore mouse events by default. When the user's cursor moves
 * over an element that we rendered in the notification window, we need to stop
 * ignoring mouse events so that the user can interact with the element.
 *
 * There are a few strategies to accomplish this with varying pros and cons and
 * varying OS support. There is a long GitHub issue about this here:
 * https://github.com/electron/electron/issues/1335#issuecomment-1585787243
 */
export default (transparentWindow: BrowserWindow): void => {
  // On Mac, we originally used the polling screenshot strategy, but users were
  // getting an issue trying to use the "Capture Selected Window" screenshot
  // option. Even when mouse events were disabled on the transparent window,
  // users could not select any window underneath as the screenshot target.
  // We think that calling `webContents.capturePage()` was somehow causing the
  // screenshot tool to always detect the transparent window as being on top of
  // everything else, but we weren't able to confirm this 100%.
  //
  // To fix this, we use a different strategy on Mac. We use the `forward`
  // option of `setIgnoreMouseEvents()` to forward mouse events to the window
  // event when mouse events are being ignored. The web contents register a
  // `mousemove` listener that informs the Electron window whether the mouse
  // is over the document (i.e. a transparent area of the window) or a child
  // element (i.e. over an opaque area of the window).
  //
  // This strategy is much better than polling because it doesn't suffer from
  // performance overhead of rapidly taking screenshots of a 1x1 pixel area,
  // but unfortunately the `forward` option was not working on Windows or
  // Linux, meaning that the `mousemove` event in the web contents would stop
  // triggering after calling `setIgnoreMouseEvents(true)`.
  if (isMac()) {
    transparentWindow.setIgnoreMouseEvents(true, { forward: true });

    let isOverTransparencyPrevious: boolean | null = null;

    ipcMain.on(
      `onMouseOverTransparentArea`,
      (event, isOverTransparency: boolean): void => {
        transparentWindow.setIgnoreMouseEvents(isOverTransparency, {
          forward: true,
        });

        if (isOverTransparency !== isOverTransparencyPrevious) {
          log.info(
            `Mouse is over transparent: ${isOverTransparencyPrevious} -> ${isOverTransparency}`
          );
        }

        isOverTransparencyPrevious = isOverTransparency;
      }
    );
  }

  // On windows and Linux, our strategy is to periodically capture a 1x1 image
  // of the pixel at the user's current cursor position. If the pixel is
  // transparent, then the user's cursor is over a transparent part of the
  // window and we should ignore mouse events. If the pixel is not transparent,
  // then the user's cursor is over a non-transparent part of the window and we
  // should not ignore mouse events.

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
};
