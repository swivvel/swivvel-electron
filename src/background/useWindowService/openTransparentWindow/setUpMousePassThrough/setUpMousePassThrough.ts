import { BrowserWindow } from 'electron';
import log from 'electron-log';
import { throttle } from 'throttle-debounce';

import { isMac } from '../../../utils';

import getMouseIgnoreHandler from './getMouseIgnoreHandler';

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
  log.info(`Configuring mouse pass through`);

  transparentWindow.setIgnoreMouseEvents(true);

  const mouseIgnoreHandler = getMouseIgnoreHandler(transparentWindow);

  // We were running into an issue on Macs where calling `capturePage()` on
  // the transparent window web contents (to get the 1x1 pixel image) would
  // make the transparent window a possible target for the "Capture Selected
  // Window" screenshot option. This prevented users from being able to take
  // a screenshot of any window underneath the transparent window.
  //
  // Instead of calling `capturePage()` in an interval, we're now calling it
  // on the mouse move event. The mouse move event is not fired while the
  // screenshot tool is open, so we are no longer calling `capturePage()`
  // while the user is choosing which window to take a screenshot of.
  //
  // We tried to use this same strategy on Windows and Linux, but the mouse
  // move event wasn't triggered after calling `setIgnoreMouseEvents(false)`,
  // so we have to keep using the interval strategy on those platforms.
  if (isMac()) {
    log.info(`Mouse pass through strategy: mouse move event`);
    const mouseIgnoreHandlerThrottled = throttle(100, mouseIgnoreHandler);

    transparentWindow.webContents.on(`input-event`, (event, inputEvent) => {
      if (inputEvent.type === `mouseMove`) {
        mouseIgnoreHandlerThrottled();
      }
    });
  } else {
    log.info(`Mouse pass through strategy: interval`);
    const interval = setInterval(async () => {
      await mouseIgnoreHandler();
      if (transparentWindow.isDestroyed()) {
        clearInterval(interval);
      }
    }, 50);
  }
};
