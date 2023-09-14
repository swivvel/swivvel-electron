import { app } from 'electron';
import log from 'electron-log';

import { OpenLogInWindow, OpenLogInWindowArgs } from './types';

export default (
  openLogInWindow: OpenLogInWindow,
  openLogInWindowArgs: OpenLogInWindowArgs
): void => {
  log.info(`Configuring app activate handler...`);

  // We only want to open one specific window when the dock is clicked, so
  // we remove all other activate listeners.
  app.removeAllListeners(`activate`);

  // Show the LogIn window when user clicks on dock on Mac
  app.on(`activate`, () => {
    log.info(`App activate event received`);
    openLogInWindow(openLogInWindowArgs);
  });
};
