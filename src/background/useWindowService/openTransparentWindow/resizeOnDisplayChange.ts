import { BrowserWindow, screen } from 'electron';
import log from 'electron-log';

import { getFullscreenBounds } from '../../utils';

/**
 * Make sure the transparent window is always resized to fit the primary
 * display.
 */
export default (window: BrowserWindow): void => {
  const resizeWindow = (): void => {
    log.info(`Display change detected`);
    log.info(`All displays: ${JSON.stringify(screen.getAllDisplays())}`);

    if (window.isDestroyed()) {
      log.info(`Transparent window destroyed; skipping resize`);
      return;
    }

    const bounds = getFullscreenBounds();
    const { height, width, x, y } = bounds;

    log.info(
      `Resizing transparent window to bounds: ${JSON.stringify(bounds)}`
    );
    window.setSize(width, height, false);
    window.setPosition(x, y, false);
  };

  screen.on(`display-added`, resizeWindow);
  screen.on(`display-removed`, resizeWindow);
  screen.on(`display-metrics-changed`, resizeWindow);
};
