import { BrowserWindow, screen } from 'electron';

import { getFullscreenBounds } from '../../utils';
import { Log } from '../utils';

/**
 * Make sure the transparent window is always resized to fit the primary
 * display.
 */
export default (window: BrowserWindow, log: Log): void => {
  const resizeWindow = (): void => {
    log(`Display change detected`);
    log(`All displays: ${JSON.stringify(screen.getAllDisplays())}`);

    if (window.isDestroyed()) {
      log(`Transparent window destroyed; skipping resize`);
      return;
    }

    const bounds = getFullscreenBounds();
    const { height, width, x, y } = bounds;

    log(`Resizing transparent window to bounds: ${JSON.stringify(bounds)}`);
    window.setSize(width, height, false);
    window.setPosition(x, y, false);
  };

  screen.on(`display-added`, resizeWindow);
  screen.on(`display-removed`, resizeWindow);
  screen.on(`display-metrics-changed`, resizeWindow);
};
