import { app } from 'electron';

import { Log } from '../utils';

import { OpenHqWindow, OpenHqWindowArgs } from './types';

export default (
  openHqWindow: OpenHqWindow,
  openHqWindowArgs: OpenHqWindowArgs,
  log: Log
): void => {
  log(`Configuring app activate handler...`);

  // We only want to open one specific window when the dock is clicked, so
  // we remove all other activate listeners.
  app.removeAllListeners(`activate`);

  // Show the HQ window when user clicks on dock on Mac
  app.on(`activate`, () => {
    log(`App activate event received`);
    openHqWindow({ ...openHqWindowArgs, show: true });
  });
};
