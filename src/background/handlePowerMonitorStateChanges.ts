import { powerMonitor } from 'electron';
import log from 'electron-log';

import { State } from './types';
import { quitApp } from './utils';

export default (state: State): void => {
  const refreshTransparentWindow = (): void => {
    if (!state.windows.transparent) {
      log.info(`No transparent window to refresh`);
    } else if (state.windows.transparent?.isDestroyed()) {
      log.info(`Transparent window is destroyed; not refreshing`);
    } else {
      log.info(`Refreshing transparent window`);
      state.windows.transparent.reload();
    }
  };

  // We have observed the app getting into a weird state when a Mac comes out
  // of sleep mode. Opening the developer tools shows a blank Elements tab and
  // nothing in the console, and clicking the "Join" button shows the spinner
  // but hangs. This only happens on a very small subset of users, but in an
  // attempt to fix it we're refreshing the transparent window whenever the
  // computer sleeps and wakes. This is probably a good idea regardless of the
  // bug because refreshing the transparent window will remove the user from the
  // audio room, and if their computer is asleep then they aren't available to
  // talk.

  powerMonitor.on(`suspend`, () => {
    log.info(`Power monitor: suspend detected`);
    if (state.windows.hq) {
      state.windows.hq.destroy();
    }
    refreshTransparentWindow();
  });

  powerMonitor.on(`resume`, () => {
    log.info(`Power monitor: resume detected`);
    refreshTransparentWindow();
  });

  // Without this, Macs would hang when trying to shut down because the
  // Swivvel app would never quit
  powerMonitor.on(`shutdown`, () => {
    log.info(`Power monitor: shutdown detected`);
    quitApp(state);
  });
};
