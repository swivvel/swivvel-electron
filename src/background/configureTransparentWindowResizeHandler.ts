import { screen } from 'electron';
import log from 'electron-log';

import { State } from './types';
import { getFullscreenBounds } from './utils';

/**
 * Make sure the transparent window is always resized to fit the primary
 * display.
 */
export default (state: State): void => {
  const resizeWindow = async (): Promise<void> => {
    log.info(`Display change detected`);
    log.info(`All displays: ${JSON.stringify(screen.getAllDisplays())}`);

    const transparentWindow = state.windows.transparent;

    if (!transparentWindow || transparentWindow.isDestroyed()) {
      log.info(`Transparent window destroyed; skipping resize`);
      return;
    }

    // The transparent window won't be the correct size while the new
    // bounds are being calculated, so we hide it to prevent the widget
    // from temporarily floating in the middle of the screen
    log.info(`Hiding transparent window`);
    transparentWindow.hide();

    if (transparentWindow.isDestroyed()) {
      log.info(`Transparent window destroyed; skipping resize`);
      return;
    }

    const bounds = await getFullscreenBounds(log.info);

    if (transparentWindow.isDestroyed()) {
      log.info(`Transparent window destroyed; skipping resize`);
      return;
    }

    log.info(
      `Resizing transparent window to bounds: ${JSON.stringify(bounds)}`
    );
    transparentWindow.setBounds(bounds, false);

    if (transparentWindow.isDestroyed()) {
      log.info(`Transparent window destroyed; skipping resize`);
      return;
    }

    log.info(`Showing transparent window`);
    transparentWindow.showInactive();
  };

  screen.on(`display-added`, resizeWindow);
  screen.on(`display-removed`, resizeWindow);
  screen.on(`display-metrics-changed`, resizeWindow);
};
