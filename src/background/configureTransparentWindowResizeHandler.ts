import { screen } from 'electron';
import log from 'electron-log';

import { State } from './types';
import { getFullscreenBounds } from './utils';

/**
 * Make sure the transparent window is always resized to fit the primary
 * display.
 */
export default (state: State): void => {
  const resizeWindow = async (
    event: `display-added` | `display-removed` | `display-metrics-changed`
  ): Promise<void> => {
    log.info(`Display change detected: ${event}`);
    log.info(`All displays: ${JSON.stringify(screen.getAllDisplays())}`);

    const transparentWindow = state.windows.transparent;

    if (!transparentWindow || transparentWindow.isDestroyed()) {
      log.info(`Transparent window destroyed; skipping resize`);
      return;
    }

    // The transparent window won't be the correct size while the new
    // bounds are being calculated, so we hide it to prevent the widget
    // from temporarily floating in the middle of the screen. However,
    // we have observed that the `display-metrics-changed` event is
    // sometimes triggered for seemingly minor display changes. For
    // example, one user had multiple `display-metrics-changed` events
    // that kept changing the work area height by 1 pixel. To avoid
    // flickering the widget in and out of view, we only hide the
    // transparent window if a display was added or removed.
    if (event === `display-added` || event === `display-removed`) {
      log.info(`Hiding transparent window`);
      transparentWindow.hide();
    }

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

  screen.on(`display-added`, () => {
    resizeWindow(`display-added`);
  });

  screen.on(`display-removed`, () => {
    resizeWindow(`display-removed`);
  });

  screen.on(`display-metrics-changed`, () => {
    resizeWindow(`display-metrics-changed`);
  });
};
