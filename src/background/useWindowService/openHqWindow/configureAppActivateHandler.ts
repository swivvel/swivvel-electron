import { app } from 'electron';
import log from 'electron-log';

import { OpenHqWindow, OpenHqWindowArgs } from './types';

export default (
  openHqWindow: OpenHqWindow,
  openHqWindowArgs: OpenHqWindowArgs
): void => {
  log.info(`Configuring app activate handler...`);

  // We only want to open one specific window when the dock is clicked, so
  // we remove all other activate listeners.
  app.removeAllListeners(`activate`);

  // Show the HQ window when user clicks on dock on Mac
  app.on(`activate`, () => {
    log.info(`App activate event received`);
    openHqWindow(openHqWindowArgs);
  });
};
