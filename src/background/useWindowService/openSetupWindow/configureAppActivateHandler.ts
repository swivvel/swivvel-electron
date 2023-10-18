import { app } from 'electron';

import { Log } from '../utils';

import { OpenSetupWindow, OpenSetupWindowArgs } from './types';

export default (
  openSetupWindow: OpenSetupWindow,
  openSetupWindowArgs: OpenSetupWindowArgs,
  log: Log
): void => {
  log(`Configuring app activate handler...`);

  // We only want to open one specific window when the dock is clicked, so
  // we remove all other activate listeners.
  app.removeAllListeners(`activate`);

  // Show the setup window when user clicks on dock on Mac
  app.on(`activate`, () => {
    log(`App activate event received`);
    openSetupWindow(openSetupWindowArgs);
  });
};
