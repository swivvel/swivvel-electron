import { screen } from 'electron';
import log from 'electron-log';

import { State } from './types';
import { getPrimaryDisplayWorkAreaBounds } from './utils';

/**
 * Make sure the transparent window is always resized to fit the primary
 * display.
 */
export default (state: State): void => {
  const resizeWindow = (): void => {
    log.info(`Display change detected`);
    log.info(`All displays: ${JSON.stringify(screen.getAllDisplays())}`);

    const transparentWindow = state.windows.transparent;

    if (!transparentWindow || transparentWindow.isDestroyed()) {
      log.info(`Transparent window destroyed; skipping resize`);
      return;
    }

    const bounds = getPrimaryDisplayWorkAreaBounds(log.info);
    const { height, width, x, y } = bounds;

    log.info(
      `Resizing transparent window to bounds: ${JSON.stringify(bounds)}`
    );
    transparentWindow.setSize(width, height, false);
    transparentWindow.setPosition(x, y, false);
  };

  screen.on(`display-added`, resizeWindow);
  screen.on(`display-removed`, resizeWindow);
  screen.on(`display-metrics-changed`, resizeWindow);
};
